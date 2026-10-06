"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../locale-provider";
import { LanguageToggle } from "../language-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }),
      });
      if (!response.ok) setError(response.status === 409 ? t("emailExists") : t("registrationFailed"));
      else {
        window.sessionStorage.setItem("nabta-registered", "1");
        router.push("/signin");
      }
    } catch {
      setError(t("connectionFailed"));
    } finally {
      setPending(false);
    }
  }

  return <main className="auth-page"><div className="auth-top"><Link className="brand" href="/"><span className="brand-mark">ن</span><span>{locale === "ar" ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link><LanguageToggle /></div><section className="auth-card"><span className="section-kicker">{t("newStory")}</span><h1>{t("growTogether")}</h1><p>{t("signUpDescription")}</p><form onSubmit={handleSubmit}><label>{t("name")}<input name="name" type="text" minLength={2} maxLength={80} autoComplete="name" required /></label><label>{t("email")}<input name="email" type="email" autoComplete="email" required /></label><label>{t("password")}<input name="password" type="password" minLength={8} maxLength={128} autoComplete="new-password" required /><small className="field-hint">{t("passwordHint")}</small></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? t("creatingAccount") : t("registerButton")}<span>←</span></button></form><div className="auth-foot">{t("hasAccount")} <Link href="/signin">{t("loginHere")}</Link></div></section></main>;
}
