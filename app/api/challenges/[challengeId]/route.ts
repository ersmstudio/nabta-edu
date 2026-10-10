import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ challengeId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "سجّل الدخول أولًا." }, { status: 401 });
  const { challengeId } = await context.params;
  let body: { code?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "الطلب غير صالح." }, { status: 400 }); }
  if (typeof body.code !== "string" || body.code.length > 30000) return Response.json({ error: "الكود مطلوب وبحد أقصى 30 ألف حرف." }, { status: 400 });
  const runnerUrl = process.env.CODE_RUNNER_URL;
  const runnerToken = process.env.CODE_RUNNER_TOKEN;
  if (!runnerUrl || !runnerToken) return Response.json({ error: "مشغل C# غير مضبوط بعد. شغّل خدمة code-runner ثم أضف إعداداتها." }, { status: 503 });
  const challenge = await prisma.codeChallenge.findFirst({ where: { id: challengeId, lesson: { status: "PUBLISHED", course: { status: "PUBLISHED" } } } });
  if (!challenge) return Response.json({ error: "التحدي غير متاح." }, { status: 404 });
  const cases = Array.isArray(challenge.testCases) ? challenge.testCases.slice(0, 8) as Array<{ input?: string; expectedOutput?: string }> : [];
  if (!cases.length) return Response.json({ error: "لم يضف المدرس حالات اختبار لهذا التحدي." }, { status: 422 });
  const results = [];
  for (const testCase of cases) {
    try {
      const response = await fetch(runnerUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${runnerToken}` }, body: JSON.stringify({ code: body.code, input: testCase.input ?? "" }), signal: AbortSignal.timeout(18000) });
      const result = await response.json() as { stdout?: string; stderr?: string; compileError?: string; timedOut?: boolean; exitCode?: number };
      const actual = (result.stdout ?? "").trim();
      const expected = (testCase.expectedOutput ?? "").trim();
      results.push({ passed: response.ok && !result.compileError && !result.timedOut && result.exitCode === 0 && actual === expected, actual, expected, compileError: result.compileError ?? "", timedOut: Boolean(result.timedOut), runtimeError: result.exitCode !== 0 && result.exitCode !== undefined ? `انتهى البرنامج بخطأ (exit ${result.exitCode}).` : "" });
    } catch { results.push({ passed: false, actual: "", expected: testCase.expectedOutput ?? "", compileError: "تعذر الوصول إلى مشغل الأكواد.", timedOut: false }); }
  }
  const passed = results.length > 0 && results.every((item) => item.passed);
  const submission = await prisma.codeSubmission.create({ data: { challengeId, userId: session.user.id, sourceCode: body.code, passed, results } });
  return Response.json({ submissionId: submission.id, passed, results: results.map((result) => ({ passed: result.passed, actual: result.actual, compileError: result.compileError, timedOut: result.timedOut, runtimeError: result.runtimeError })) });
}
