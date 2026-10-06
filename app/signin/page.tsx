"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../locale-provider";
import { LanguageToggle } from "../language-toggle";

export default function SignInPage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("nabta-registered")) {
      setNotice("تم إنشاء حسابك بنجاح. سجّل دخولك وابدأ رحلتك!");
      window.sessionStorage.removeItem("nabta-registered");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setPending(false);
    if (result?.error) setError(t("invalidLogin"));
    else router.push("/");
  }

  return <main className="auth-page"><div className="auth-top"><Link className="brand" href="/"><span className="brand-mark">ن</span><span>{locale === "ar" ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link><LanguageToggle /></div><section className="auth-card"><span className="section-kicker">{t("welcomeBack")}</span><h1>{t("happySeeYou")}</h1><p>{t("signInDescription")}</p>{notice && <p className="form-success" role="status">{t("signupSuccess")}</p>}<form onSubmit={handleSubmit}><label>{t("email")}<input name="email" type="email" autoComplete="email" required /></label><label>{t("password")}<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? t("signingIn") : t("signInButton")}<span>←</span></button></form><div className="auth-foot">{t("noAccount")} <Link href="/register">{t("signUpFree")}</Link></div></section></main>;
}
