"use client";

import Link from "next/link";
import { LanguageToggle } from "./language-toggle";
import { useLocale } from "./locale-provider";

export function CourseDetailPage({ title, description, lessons, theme, icon }: {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  lessons: { ar: string[]; en: string[] };
  theme: "game" | "web";
  icon: string;
}) {
  const { locale, t } = useLocale();
  const isArabic = locale === "ar";
  return (
    <main className={"course-page theme-" + theme}>
      <header className="site-header">
        <Link className="brand" href="/" aria-label={isArabic ? "نبتة، الصفحة الرئيسية" : "Nabta, home"}><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link>
        <nav className="main-nav"><Link href="/">{t("home")}</Link><Link className="nav-active" href="/courses/Programming">{t("paths")}</Link><Link href="/#about">{t("about")}</Link><Link href="/#footer">{t("contact")}</Link></nav>
        <div className="header-actions"><LanguageToggle /><Link className="login-link" href="/signin">{t("signIn")}</Link><Link className="button button-small" href="/register">{t("start")} <span>←</span></Link></div>
      </header>
      <section className="course-theme-hero">
        <div className="course-theme-copy"><span className="section-kicker">{isArabic ? "مسار البرمجة والتقنية" : "Coding and technology"}</span><h1>{title[locale]}</h1><p>{description[locale]}</p><Link className="button" href="#course-outline">{isArabic ? "شوف هتتعلم إيه" : "See what you’ll learn"} <span>↓</span></Link></div>
        <div className="course-theme-art" aria-hidden="true"><span>{icon}</span><i>&lt;/&gt;</i><b>✦</b></div>
      </section>
      <section className="courses-section">
        <Link className="text-link" href="/courses/Programming">← {isArabic ? "العودة إلى كورسات البرمجة" : "Back to programming courses"}</Link>
        <article className="course-card mint course-outline" id="course-outline"><h2>{isArabic ? "ماذا ستتعلّم؟" : "What you’ll learn"}</h2><ol>{lessons[locale].map((lesson) => <li key={lesson}>{lesson}</li>)}</ol></article>
        <div className="hero-actions"><Link className="button" href="/register">{isArabic ? "ابدأ التعلّم" : "Start learning"} <span>←</span></Link><Link className="text-link" href="/courses/Programming">{isArabic ? "تصفّح كورسات البرمجة" : "Browse programming courses"}</Link></div>
      </section>
      <footer id="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link><p>{t("footerLine")}</p><span>{t("copyright")}</span></footer>
    </main>
  );
}
