import { CoursePathPage, type PathItem } from "../../course-path-page";

const items: { ar: PathItem[]; en: PathItem[] } = {
  ar: [
    { title: "ارسم شخصيتك الأولى", description: "اكتشف الأشكال والألوان، وابتكر شخصية تعبّر عن فكرتك.", label: "رسم" },
    { title: "حرّك حكايتك", description: "حوّل رسوماتك إلى مشاهد بسيطة تحكي قصة من خيالك.", label: "أنيميشن" },
    { title: "اصنع مشهدًا قصيرًا", description: "اجمع الشخصية والخلفية والحركة في مشروعك الإبداعي الأول.", label: "مشروع إبداعي" },
  ],
  en: [
    { title: "Draw your first character", description: "Explore shapes and colors to create a character that brings your idea to life.", label: "Drawing" },
    { title: "Animate your story", description: "Turn your drawings into simple scenes that tell a story from your imagination.", label: "Animation" },
    { title: "Create a short scene", description: "Bring a character, a background, and movement together in your first creative project.", label: "Creative project" },
  ],
};

export default function AnimationCoursesPage() {
  return <CoursePathPage theme="art" icon="🎨" title={{ ar: "الأنيميشن والرسم", en: "Animation and art" }} description={{ ar: "ارسم أفكارك وحوّلها إلى حكايات متحركة.", en: "Draw your ideas and turn them into animated stories." }} items={items} />;
}
