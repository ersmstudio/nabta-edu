"use client";

import Link from "next/link";
import { LanguageToggle } from "./language-toggle";
import { useLocale } from "./locale-provider";

export type PathItem = { title: string; description: string; label: string; href?: string };

export function CoursePathPage({ title, description, items, theme, icon }: {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  items: { ar: PathItem[]; en: PathItem[] };
  theme: "art" | "code" | "science";
  icon: string;
}) {
  const { locale, t } = useLocale();
  const isArabic = locale === "ar";

  return (
    <main className={`course-page theme-${theme}`}>
      <header className="site-header">
        <Link className="brand" href="/" aria-label={isArabic ? "نبتة، الصفحة الرئيسية" : "Nabta, home"}><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link>
        <nav className="main-nav"><Link href="/">{t("home")}</Link><Link className="nav-active" href="/courses/Programming">{t("paths")}</Link><Link href="/#about">{t("about")}</Link><Link href="/#footer">{t("contact")}</Link></nav>
        <div className="header-actions"><LanguageToggle /><Link className="login-link" href="/signin">{t("signIn")}</Link><Link className="button button-small" href="/register">{t("start")} <span>←</span></Link></div>
      </header>
      <section className="course-theme-hero">
        <div className="course-theme-copy"><span className="section-kicker">{isArabic ? "اختار طريقك وابدأ خطوة خطوة" : "Choose your path and learn step by step"}</span><h1>{title[locale]}</h1><p>{description[locale]}</p><Link className="button" href="#course-list">{isArabic ? "تصفّح محتوى المسار" : "Explore this path"} <span>↓</span></Link></div>
        <div className="course-theme-art" aria-hidden="true"><span>{icon}</span><i>✦</i><b>✳</b></div>
      </section>
      <section className="courses-section" id="course-list">
        <div className="section-heading"><div><span className="section-kicker">{t("pathsGrow")}</span><h1>{title[locale]}</h1><p>{description[locale]}</p></div><Link className="text-link" href="/">{isArabic ? "العودة للرئيسية" : "Back to home"} ←</Link></div>
        <div className="course-grid">{items[locale].map((item, index) => {
          const content = <><div className="course-top"><span className="course-tag">{item.label}</span><span className="card-number">0{index + 1}</span></div><h2>{item.title}</h2><p>{item.description}</p>{item.href && <div className="course-bottom"><span>{isArabic ? "شاهد تفاصيل الكورس" : "View course details"}</span><span className="arrow-circle">←</span></div>}</>;
          return item.href ? <Link className="course-card lavender" href={item.href} key={item.title}>{content}</Link> : <article className="course-card lavender" key={item.title}>{content}<div className="course-bottom"><span>{isArabic ? "قريبًا" : "Coming soon"}</span></div></article>;
        })}</div>
      </section>
      <section className="about-strip" id="about"><div className="about-leaf">✿</div><div><span className="section-kicker">{t("learnOurWay")}</span><h2>{t("notJustCourses")}<br /><span>{t("spaceToGrow")}</span></h2></div><p>{t("aboutText")}</p><Link className="button button-light" href="/">{isArabic ? "اكتشف المسارات" : "Explore paths"} <span>←</span></Link></section>
      <footer id="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link><p>{t("footerLine")}</p><span>{t("copyright")}</span></footer>
    </main>
  );
}
