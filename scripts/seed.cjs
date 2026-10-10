/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      slug: "animation",
      titleAr: "الأنيميشن والرسم",
      titleEn: "Animation and art",
      descriptionAr: "ارسم أفكارك وحوّلها إلى حكايات متحركة.",
      descriptionEn: "Draw your ideas and turn them into animated stories.",
      icon: "🎨",
      theme: "art",
      sortOrder: 1,
    },
    {
      slug: "programming",
      titleAr: "البرمجة والتقنية",
      titleEn: "Coding and technology",
      descriptionAr: "ابدأ من الأساسيات واصنع مشاريعك الأولى.",
      descriptionEn: "Learn the basics and build your first projects.",
      icon: "⌘",
      theme: "code",
      sortOrder: 2,
    },
    {
      slug: "science",
      titleAr: "الطبيعة والعلوم",
      titleEn: "Nature and science",
      descriptionAr: "اكتشف العالم من حولك بتجارب ممتعة.",
      descriptionEn: "Explore the world around you through fun experiments.",
      icon: "🌿",
      theme: "science",
      sortOrder: 3,
    },
  ];

  for (const category of categories) {
    await prisma.courseCategory.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    });
  }

  const programming = await prisma.courseCategory.findUniqueOrThrow({ where: { slug: "programming" } });
  await prisma.course.upsert({
    where: { slug: "csharp" },
    update: {},
    create: {
      categoryId: programming.id,
      slug: "csharp",
      titleAr: "كورس لغة C#",
      titleEn: "C# Programming Course",
      descriptionAr: "سلسلة مرتبة لتعلّم أساسيات لغة C# خطوة بخطوة.",
      descriptionEn: "A sequenced series for learning C# step by step.",
      theme: "code",
      status: "PUBLISHED",
      sortOrder: 1,
      lessons: {
        create: [
          {
            slug: "episode-00",
            titleAr: "معلومات عامة عن C# وثقافة في البرمجة",
            titleEn: "C# overview and programming culture",
            descriptionAr: "مقدمة عن لغة سي شارب وبعض المفاهيم والثقافة العامة في البرمجة.",
            descriptionEn: "An introduction to C# and general programming concepts.",
            videoUrl: "https://www.youtube.com/watch?v=jqI1333wa14",
            transcript: "",
            sortOrder: 0,
            status: "PUBLISHED",
          },
          {
            slug: "episode-01",
            titleAr: "بلوك البرمجة الأساسي في Console Application",
            titleEn: "The basic structure of a C# Console Application",
            descriptionAr: "التعرّف على البنية الأساسية لبرنامج Console في لغة C#.",
            descriptionEn: "An introduction to the basic structure of a C# console program.",
            videoUrl: "https://www.youtube.com/watch?v=NT8SWSnAhnk",
            transcript: "",
            sortOrder: 1,
            status: "PUBLISHED",
          },
        ],
      },
    },
  });

  for (const course of [
    {
      slug: "unity-3d",
      titleAr: "تطوير ألعاب 3D باستخدام Unity",
      titleEn: "Build 3D Games with Unity",
      descriptionAr: "اتعلم أساسيات تحريك الكاميرا وأنظمة اللعب، وابدأ ببناء عالمك الأول.",
      descriptionEn: "Learn camera movement and game systems as you build your first world.",
      theme: "game",
      sortOrder: 2,
    },
    {
      slug: "nextjs-basics",
      titleAr: "أساسيات Next.js للمبتدئين",
      titleEn: "Next.js Basics for Beginners",
      descriptionAr: "تعرّف على الصفحات والروابط، وابدأ بناء موقعك خطوة بخطوة.",
      descriptionEn: "Learn pages and links, then build your website step by step.",
      theme: "web",
      sortOrder: 3,
    },
  ]) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: { ...course, categoryId: programming.id, status: "DRAFT" },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main" },
    update: {},
  });
  console.log("Initial course categories and the C# playlist are ready.");
}

main()
  .catch(() => {
    console.error("Could not seed the course content.");
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
