"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useAppState } from "../app-state-provider";
import { useLocale } from "../locale-provider";
import { LanguageToggle } from "../language-toggle";

const courses = [
  { id: 1, title: "تطوير ألعاب 3D باستخدام Unity", description: "اتعلم أساسيات تحريك الكاميرا وأنظمة اللعب.", price: "مجاني" },
  { id: 2, title: "أساسيات Next.js للمبتدئين", description: "ابني منصتك التعليمية من الصفر بكل سهولة.", price: "مدفوع" },
];

export default function CoursesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { courseQuery, setCourseQuery } = useAppState();
  const { data: session, status } = useSession();
  const { locale, t } = useLocale();
  const isSignedIn = status === "authenticated";
  const shownCourses = courses.filter((course) =>
    `${course.title} ${course.description}`.toLowerCase().includes(courseQuery.trim().toLowerCase())
  );

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label={locale === "ar" ? "نبتة، الصفحة الرئيسية" : "Nabta, home"}>
          <span className="brand-mark">ن</span><span>{locale === "ar" ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span>
        </Link>
        <button className="mobile-toggle" aria-label={t("menu")} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "×" : "☰"}</button>
        <nav className={mobileOpen ? "main-nav nav-open" : "main-nav"}>
          <Link href="/">{t("home")}</Link><Link className="nav-active" href="/ProgrammingCourses">{t("paths")}</Link><Link href="/#about">{t("about")}</Link><Link href="/#footer">{t("contact")}</Link>
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          {isSignedIn ? <Link className="button button-small" href="/ProgrammingCourses">{t("myCourses")} <span>←</span></Link> : <><Link className="login-link" href="/signin">{t("signIn")}</Link><Link className="button button-small" href="/register">{t("start")} <span>←</span></Link></>}
          <button className="avatar-button" aria-label={locale === "ar" ? "قائمة الحساب" : "Account menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{isSignedIn ? (session?.user?.name?.charAt(0) ?? "ن") : "ن"}</button>
          {menuOpen && <div className="account-menu"><strong>{isSignedIn ? `${t("welcome")} ${session?.user?.name ?? t("learner")} 🌿` : t("account")}</strong>{isSignedIn ? <><Link href="/ProgrammingCourses">{t("learningPaths")}</Link><button className="logout-button" onClick={() => { void signOut({ redirect: false }).then(() => window.location.assign("/")); }}>{t("signOut")}</button></> : <><Link href="/signin">{t("signIn")}</Link><Link href="/register">{t("createAccount")}</Link></>}<Link href="/#footer">{t("support")}</Link></div>}
        </div>
      </header>

      <section className="courses-section">
        <div className="section-heading">
          <div><span className="section-kicker">{t("pathsGrow")}</span><h1>{locale === "ar" ? "كورسات البرمجة" : "Programming courses"}</h1></div>
          <label className="course-search"><span>⌕</span><input value={courseQuery} onChange={(event) => setCourseQuery(event.target.value)} placeholder={t("searchPath")} aria-label={t("searchPath")} /></label>
        </div>
        <div className="course-grid">
          {shownCourses.length ? shownCourses.map((course) => (
            <article className="course-card lavender" key={course.id}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-bottom"><span>{course.price}</span><button className="arrow-circle" type="button">{locale === "ar" ? "شاهد الكورس" : "View course"}</button></div>
            </article>
          )) : <p className="empty-state">{t("noResults")}</p>}
        </div>
      </section>
    </main>
  );
}
