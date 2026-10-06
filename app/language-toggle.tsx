"use client";

import { useLocale } from "./locale-provider";

export function LanguageToggle() {
  const { locale, t, toggleLocale } = useLocale();
  return <button className="language-toggle" type="button" onClick={toggleLocale} aria-label={t("languageLabel")} lang={locale === "ar" ? "en" : "ar"}>{t("languageName")}</button>;
}
