"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageToggle } from "./language-toggle";
import { useLocale } from "./locale-provider";

const episodes = [
  {
    number: 0,
    duration: "10:24",
    videoId: "jqI1333wa14",
    title: { ar: "معلومات عامة عن C# وثقافة في البرمجة", en: "C# overview and programming culture" },
    description: { ar: "مقدمة عن لغة سي شارب وبعض المفاهيم والثقافة العامة في البرمجة.", en: "An introduction to C# and some general programming concepts and culture." },
  },
  {
    number: 1,
    duration: "19:44",
    videoId: "NT8SWSnAhnk",
    title: { ar: "بلوك البرمجة الأساسي في Console Application", en: "The basic structure of a C# Console Application" },
    description: { ar: "التعرّف على البنية الأساسية لبرنامج Console في لغة C#.", en: "An introduction to the basic structure of a C# console program." },
  },
];

export function CSharpCoursePage() {
  const { locale, t } = useLocale();
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const isArabic = locale === "ar";
  const episode = episodes[selectedEpisode];

  return (
    <main className="course-page theme-code">
      <header className="site-header">
        <Link className="brand" href="/" aria-label={isArabic ? "نبتة، الصفحة الرئيسية" : "Nabta, home"}><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link>
        <nav className="main-nav"><Link href="/">{t("home")}</Link><Link className="nav-active" href="/courses/Programming">{t("paths")}</Link><Link href="/#about">{t("about")}</Link><Link href="/#footer">{t("contact")}</Link></nav>
        <div className="header-actions"><LanguageToggle /><Link className="login-link" href="/signin">{t("signIn")}</Link><Link className="button button-small" href="/register">{t("start")} <span>←</span></Link></div>
      </header>

      <section className="course-theme-hero csharp-hero">
        <div className="course-theme-copy"><span className="section-kicker">{isArabic ? "مسار البرمجة والتقنية · C#" : "Coding and technology · C#"}</span><h1>{isArabic ? "كورس لغة C#" : "C# Programming Course"}</h1><p>{isArabic ? "سلسلة مرتبة من الحلقات تساعدك تتعلم أساسيات C# خطوة بخطوة. شغّل الحلقة، واكتب الأمثلة بنفسك، وتعال نطوّرها معًا." : "A sequenced series to help you learn C# step by step. Play an episode, write the examples yourself, and build on them with me."}</p><div className="course-stats"><span>{isArabic ? "حلقتان متاحتان" : "2 episodes available"}</span><span>{isArabic ? "المصدر: Ersm School" : "Source: Ersm School"}</span></div></div>
        <div className="course-theme-art code-art" aria-hidden="true"><span>C#</span><i>&lt;/&gt;</i><b>✦</b></div>
      </section>

      <section className="csharp-learning-section">
        <div className="section-heading"><div><span className="section-kicker">{isArabic ? "تابع من حيث توقفت" : "Continue where you left off"}</span><h2>{isArabic ? "حلقات الكورس" : "Course episodes"}</h2><p>{isArabic ? "الترتيب مطابق لقائمة التشغيل، وكل حلقة بتفتح هنا مباشرة." : "The order follows the playlist, and each episode plays right here."}</p></div></div>
        <div className="csharp-learning-grid">
          <section className="csharp-player-card" aria-label={isArabic ? "مشغل الحلقة" : "Episode player"}>
            <div className="video-frame"><iframe key={episode.videoId} src={"https://www.youtube-nocookie.com/embed/" + episode.videoId} title={episode.title[locale]} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
            <div className="playing-episode"><span className="episode-number">{String(episode.number).padStart(2, "0")}</span><div><span className="section-kicker">{isArabic ? "الحلقة " + String(episode.number).padStart(2, "0") : "Episode " + String(episode.number).padStart(2, "0")}</span><h3>{episode.title[locale]}</h3><p>{episode.description[locale]}</p></div></div>
            <div className="episode-controls"><button type="button" onClick={() => setSelectedEpisode((current) => Math.max(current - 1, 0))} disabled={selectedEpisode === 0}>{isArabic ? "← الحلقة السابقة" : "← Previous episode"}</button><a href={"https://www.youtube.com/watch?v=" + episode.videoId} target="_blank" rel="noreferrer">{isArabic ? "فتح على YouTube ↗" : "Open on YouTube ↗"}</a><button type="button" onClick={() => setSelectedEpisode((current) => Math.min(current + 1, episodes.length - 1))} disabled={selectedEpisode === episodes.length - 1}>{isArabic ? "الحلقة التالية →" : "Next episode →"}</button></div>
          </section>
          <aside className="episode-list-card"><div className="episode-list-heading"><strong>{isArabic ? "محتوى الكورس" : "Course content"}</strong><span>{episodes.length} {isArabic ? "حلقة" : "episodes"}</span></div><ol>{episodes.map((item, index) => <li key={item.videoId}><button className={index === selectedEpisode ? "episode-choice is-active" : "episode-choice"} type="button" aria-current={index === selectedEpisode ? "step" : undefined} onClick={() => setSelectedEpisode(index)}><span className="episode-choice-number">{String(item.number).padStart(2, "0")}</span><span className="episode-choice-copy"><strong>{item.title[locale]}</strong><small>{isArabic ? "الحلقة " + String(item.number).padStart(2, "0") : "Episode " + String(item.number).padStart(2, "0")}</small></span><span className="episode-duration">{item.duration}</span></button></li>)}</ol><p className="playlist-note">{isArabic ? "دي كل الحلقات الظاهرة حاليًا في قائمة التشغيل. أول ما تضيف حلقات جديدة، نرتّبها هنا." : "These are the episodes currently in the playlist. New episodes can be added here in order."}</p></aside>
        </div>
      </section>
      <section className="course-note"><div><span className="section-kicker">{isArabic ? "تعلّم بالتطبيق" : "Learn by doing"}</span><h2>{isArabic ? "شغّل الحلقة واكتب الكود معايا" : "Play the episode and code along"}</h2><p>{isArabic ? "هنبني على أمثلة الحلقات تدريجيًا: نفهم كل سطر، نجرّب تعديلات صغيرة، وبعدها نطوّر مشروعًا عمليًا سوا." : "We’ll build on the episodes gradually: understand each line, try small changes, then grow a practical project together."}</p></div><Link className="button button-light" href="/courses/Programming">{isArabic ? "كل كورسات البرمجة" : "All programming courses"} <span>←</span></Link></section>
      <footer id="footer"><Link className="brand footer-brand" href="/"><span className="brand-mark">ن</span><span>{isArabic ? "نبتة" : "Nabta"}<span className="brand-dot">.</span><small>{t("slogan")}</small></span></Link><p>{t("footerLine")}</p><span>{t("copyright")}</span></footer>
    </main>
  );
}
