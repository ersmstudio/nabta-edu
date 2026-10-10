import { CoursePathPage, type PathItem } from "../../course-path-page";

const items: { ar: PathItem[]; en: PathItem[] } = {
  ar: [
    { title: "كورس لغة C#", description: "تعلّم بالترتيب من مقدمة اللغة وثقافة البرمجة إلى أساسيات تطبيقات Console.", label: "حلقتان متاحتان", href: "/courses/Programming/csharp" },
    { title: "تطوير ألعاب 3D باستخدام Unity", description: "اتعلم أساسيات تحريك الكاميرا وأنظمة اللعب، وابدأ ببناء عالمك الأول.", label: "ألعاب وتطوير", href: "/courses/Programming/unity-3d" },
    { title: "أساسيات Next.js للمبتدئين", description: "تعرّف على الصفحات والروابط، وابدأ بناء موقعك التعليمي خطوة بخطوة.", label: "تطوير الويب", href: "/courses/Programming/nextjs-basics" },
  ],
  en: [
    { title: "C# Programming Course", description: "Learn in order, from C# and programming culture to the basics of console apps.", label: "2 episodes available", href: "/courses/Programming/csharp" },
    { title: "Build 3D Games with Unity", description: "Learn camera movement and game systems as you build your first world.", label: "Game development", href: "/courses/Programming/unity-3d" },
    { title: "Next.js Basics for Beginners", description: "Learn pages and links, then build your learning website step by step.", label: "Web development", href: "/courses/Programming/nextjs-basics" },
  ],
};

export default function ProgrammingCoursesPage() {
  return <CoursePathPage theme="code" icon="⌘" title={{ ar: "كورسات البرمجة", en: "Programming courses" }} description={{ ar: "ابدأ بفكرة صغيرة، وتعلّم المهارات التي تساعدك على صنعها.", en: "Start with a small idea and learn the skills to bring it to life." }} items={items} />;
}
