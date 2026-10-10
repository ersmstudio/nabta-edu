import { CourseDetailPage } from "../../../course-detail-page";

export default function UnityCoursePage() {
  return <CourseDetailPage theme="game" icon="🎮" title={{ ar: "تطوير ألعاب 3D باستخدام Unity", en: "Build 3D Games with Unity" }} description={{ ar: "تعلّم كيف تبني مشهدًا ثلاثي الأبعاد وتضيف إليه الحركة والتفاعل.", en: "Learn to build a 3D scene and bring it to life with movement and interaction." }} lessons={{ ar: ["التعرّف على مساحة العمل والمشهد ثلاثي الأبعاد", "تحريك الكاميرا والعناصر داخل اللعبة", "إضافة قواعد لعب وتفاعل بسيط"], en: ["Explore the workspace and 3D scenes", "Move the camera and objects in a game", "Add simple game rules and interactions"] }} />;
}
