/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const { spawn } = require("node:child_process");
const { randomUUID, timingSafeEqual } = require("node:crypto");
const token = process.env.CODE_RUNNER_TOKEN;
if (!token || token.length < 32) throw new Error("CODE_RUNNER_TOKEN must contain at least 32 characters");
const image = process.env.CSHARP_SANDBOX_IMAGE || "nabta-csharp-sandbox:8.0";
let active = 0;
const server = http.createServer((req, res) => {
  const send = (status, body) => { res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" }); res.end(JSON.stringify(body)); };
  if (req.method !== "POST" || req.url !== "/execute") return send(404, { error: "not_found" });
  const supplied = Buffer.from((req.headers.authorization || "").replace(/^Bearer\s+/i, "")); const expected = Buffer.from(token);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return send(401, { error: "unauthorized" });
  if (active >= 2) return send(429, { error: "runner_busy" });
  let raw = "";
  req.on("data", (chunk) => { raw += chunk; if (raw.length > 50000) { send(413, { error: "payload_too_large" }); req.destroy(); } });
  req.on("end", () => {
    let body; try { body = JSON.parse(raw); } catch { return send(400, { error: "invalid_json" }); }
    if (typeof body.code !== "string" || body.code.length > 30000 || typeof body.input !== "string" || body.input.length > 8000) return send(400, { error: "invalid_payload" });
    active++; const name = `nabta-student-${randomUUID()}`;
    const container = spawn("docker", ["run", "--rm", "-i", "--name", name, "--network", "none", "--memory", "384m", "--memory-swap", "384m", "--cpus", "0.5", "--pids-limit", "48", "--ulimit", "core=0", "--read-only", "--tmpfs", "/tmp:rw,nosuid,nodev,size=96m,uid=10001,gid=10001", "--user", "10001:10001", "--cap-drop=ALL", "--security-opt=no-new-privileges", image], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "", done = false;
    const finish = (result) => { if (done) return; done = true; clearTimeout(timer); active--; send(200, result); };
    const timer = setTimeout(() => { spawn("docker", ["rm", "-f", name], { stdio: "ignore" }); finish({ stdout, stderr, timedOut: true }); }, 10000);
    container.stdout.on("data", (b) => { if (stdout.length < 12000) stdout += b.toString().slice(0, 12000 - stdout.length); });
    container.stderr.on("data", (b) => { if (stderr.length < 12000) stderr += b.toString().slice(0, 12000 - stderr.length); });
    container.on("error", () => finish({ stdout: "", stderr: "Sandbox runtime unavailable", compileError: "لم يتم تشغيل صورة بيئة C# بعد." }));
    container.on("close", (code) => { const marker = "__NABTA_COMPILE_OK__"; if (stdout.includes(marker)) stdout = stdout.slice(stdout.indexOf(marker) + marker.length).replace(/^\r?\n/, ""); else if (code !== 0 && !done) { finish({ stdout: "", stderr, compileError: stderr || "فشل بناء الكود." }); return; } finish({ stdout, stderr, exitCode: code }); });
    container.stdin.end(`${Buffer.from(body.code).toString("base64")}\n${Buffer.from(body.input).toString("base64")}\n`);
  });
});
server.listen(8787, "0.0.0.0", () => console.log("C# runner listening on :8787"));
