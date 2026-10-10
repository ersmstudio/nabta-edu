import { CourseDetailPage } from "../../../course-detail-page";

export default function NextBasicsCoursePage() {
  return <CourseDetailPage theme="web" icon="🌐" title={{ ar: "أساسيات Next.js للمبتدئين", en: "Next.js Basics for Beginners" }} description={{ ar: "تعرّف على بناء صفحات موقع وربطها معًا، خطوة بخطوة.", en: "Learn to build website pages and connect them, step by step." }} lessons={{ ar: ["إنشاء صفحات باستخدام المجلدات", "التنقل بين الصفحات والروابط", "بناء واجهة بسيطة لمشروعك الأول"], en: ["Create pages with folders", "Navigate between pages with links", "Build a simple interface for your first project"] }} />;
}
