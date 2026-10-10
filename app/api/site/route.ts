import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, settings] = await Promise.all([
      prisma.courseCategory.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, include: { courses: { where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" }, select: { id: true, slug: true, titleAr: true, titleEn: true, descriptionAr: true, descriptionEn: true, imageUrl: true, theme: true } } } }),
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
    ]);
    return Response.json({ categories, settings });
  } catch {
    return Response.json({ error: "تعذر تحميل محتوى الموقع." }, { status: 500 });
  }
}
