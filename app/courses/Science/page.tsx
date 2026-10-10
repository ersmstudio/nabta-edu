import { CoursePathPage, type PathItem } from "../../course-path-page";

const items: { ar: PathItem[]; en: PathItem[] } = {
  ar: [
    { title: "أسرار النباتات", description: "راقب كيف تنمو النباتات واكتشف ما تحتاجه لتعيش.", label: "الطبيعة" },
    { title: "تجارب علمية ممتعة", description: "اسأل، توقّع، وجرّب تجارب بسيطة وآمنة في البيت.", label: "تجارب" },
    { title: "اكتشف كوكبنا", description: "تعرّف على الطقس والماء والبيئات التي تشاركنا الحياة.", label: "علوم" },
  ],
  en: [
    { title: "The secrets of plants", description: "See how plants grow and discover what they need to thrive.", label: "Nature" },
    { title: "Fun science experiments", description: "Ask questions, make a guess, and try simple, safe experiments at home.", label: "Experiments" },
    { title: "Discover our planet", description: "Explore weather, water, and the environments we share.", label: "Science" },
  ],
};

export default function ScienceCoursesPage() {
  return <CoursePathPage theme="science" icon="🌿" title={{ ar: "الطبيعة والعلوم", en: "Nature and science" }} description={{ ar: "اكتشف العالم من حولك بتجارب ممتعة وأسئلة جديدة.", en: "Explore the world around you through fun experiments and new questions." }} items={items} />;
}
