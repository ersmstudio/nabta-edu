"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLocale } from "./locale-provider";
import { LanguageToggle } from "./language-toggle";
import { useAppState } from "./app-state-provider";

const courses = [
  { icon: "✏️", title: { ar: "الأنيميشن والرسم", en: "Animation and art" }, text: { ar: "ارسم أفكارك وحوّلها إلى حكايات متحركة.", en: "Draw your ideas and turn them into animated stories." }, tag: { ar: "إبداع", en: "Creativity" }, color: "peach", href: "/courses/Animation" },
  { icon: "⌘", title: { ar: "البرمجة والتقنية", en: "Coding and technology" }, text: { ar: "ابدأ من الأساسيات واصنع مشاريعك الأولى.", en: "Learn the basics and build your first projects." }, tag: { ar: "تقنية", en: "Technology" }, color: "lavender", href: "/courses/Programming" },
  { icon: "🌱", title: { ar: "الطبيعة والعلوم", en: "Nature and science" }, text: { ar: "اكتشف العالم من حولك بتجارب ممتعة.", en: "Explore the world around you through fun experiments." }, tag: { ar: "اكتشاف", en: "Discovery" }, color: "mint", href: "/courses/Science" },
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { courseQuery: query, setCourseQuery: setQuery } = useAppState();
  const { data: session, status } = useSession();
  const { locale, t } = useLocale();
  const isSignedIn = status === "authenticated";
  const shownCourses = courses.filter((course) => `${course.title[locale]} ${course.text[locale]} ${course.tag[locale]}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="نبتة، الصفحة الرئيسية">
          <span className="brand-mark">ن</span><span>{locale === "ar" ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span>
        </a>
        <button className="mobile-toggle" aria-label={t("menu")} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "×" : "☰"}</button>
        <nav className={mobileOpen ? "main-nav nav-open" : "main-nav"}>
          <a className="nav-active" href="#home">{t("home")}</a><a href="#courses">{t("paths")}</a><a href="#about">{t("about")}</a><a href="#footer">{t("contact")}</a>
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          {isSignedIn ? <a className="button button-small" href="#courses">{t("myCourses")} <span>←</span></a> : <><a className="login-link" href="/signin">{t("signIn")}</a><a className="button button-small" href="/register">{t("start")} <span>←</span></a></>}
          <button className="avatar-button" aria-label="قائمة الحساب" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{isSignedIn ? (session?.user?.name?.charAt(0) ?? "ن") : "ن"}</button>
          {menuOpen && <div className="account-menu"><strong>{isSignedIn ? `${t("welcome")} ${session?.user?.name ?? t("learner")} 🌿` : t("account")}</strong>{isSignedIn ? <><a href="#courses">{t("learningPaths")}</a><button className="logout-button" onClick={() => { void signOut({ redirect: false }).then(() => window.location.assign("/")); }}>{t("signOut")}</button></> : <><a href="/signin">{t("signIn")}</a><a href="/register">{t("createAccount")}</a></>}<a href="#footer">{t("support")}</a></div>}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-leaf">✳</span> {t("heroEyebrow")}</div>
          <h1>{t("heroLine1")}<br /><span>{t("heroLine2")}</span></h1>
          <p>{t("heroDescription")}</p>
          <div className="hero-actions"><a className="button" href="#courses">{t("explorePaths")} <span>←</span></a><a className="text-link" href="#about"><span className="play-icon">▶</span> {t("meetNabta")}</a></div>
          <div className="social-proof"><div className="avatar-stack"><span>🌱</span></div><div><strong>{t("threePaths")}</strong><small>{t("startSmall")}</small></div><span className="proof-star">✦</span></div>
        </div>
        <div className="hero-art">
          <div className="art-wash"></div><div className="art-sun"></div>
          <div className="art-note note-top"><span>✨</span><div><b>{t("ideaNext")}</b><small>{t("changeEverything")}</small></div></div>
          <div className="art-image"><Image src="/slide2.jpg" alt="تعلّم ممتع وإبداع في عالم نبتة" fill priority sizes="(max-width: 650px) 300px, 360px" /></div>
          <div className="art-plant">🌿</div><div className="art-note note-bottom"><span className="growth-icon">↗</span><div><b>{t("takeYourTime")}</b><small>{t("everyStep")}</small></div></div>
          <span className="sparkle sparkle-one">✳</span><span className="sparkle sparkle-two">✦</span>
        </div>
        <div className="hero-bottom"><span>{t("growCuriosity")}</span><span>↓</span></div>
      </section>

      <section className="courses-section" id="courses">
        <div className="section-heading"><div><span className="section-kicker">{t("pathsGrow")}</span><h2>{t("whereStart")}</h2><p>{t("choosePath")}</p></div><label className="course-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPath")} aria-label={t("searchPath")} /></label></div>
        <div className="course-grid">{shownCourses.length ? shownCourses.map((course, index) => <Link className={`course-card ${course.color}`} href={course.href} key={course.color}><div className="course-top"><span className="course-icon">{course.icon}</span><span className="course-tag">{course.tag[locale]}</span></div><h3>{course.title[locale]}</h3><p>{course.text[locale]}</p><div className="course-bottom"><span>{t("explorePath")}</span><span className="arrow-circle">←</span></div><span className="card-number">0{index + 1}</span></Link>) : <p className="empty-state">{t("noResults")}</p>}</div>
      </section>

      <section className="about-strip" id="about"><div className="about-leaf">✿</div><div><span className="section-kicker">{t("learnOurWay")}</span><h2>{t("notJustCourses")}<br /><span>{t("spaceToGrow")}</span></h2></div><p>{t("aboutText")}</p><a className="button button-light" href="#courses">{t("ourStory")} <span>←</span></a></section>

      <footer id="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">ن</span><span>{locale === "ar" ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></a><p>{t("footerLine")}</p><span>{t("copyright")}</span></footer>
    </main>
  );
}
