import { ContentStatus, Prisma, QuestionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const questionTypes = new Set<QuestionType>(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "DROPDOWN", "TRUE_FALSE", "SHORT_ANSWER", "LONG_ANSWER"]);
const contentStatuses = new Set<ContentStatus>(["DRAFT", "PUBLISHED", "ARCHIVED"]);

function text(value: unknown, max = 6000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeJson(value: unknown, fallback: Prisma.InputJsonValue = []) {
  try {
    const serialized = JSON.stringify(value ?? fallback);
    return JSON.parse(serialized) as Prisma.InputJsonValue;
  } catch {
    return fallback;
  }
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
}

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const [categories, courses, students, lessons, attempts, submissions, recentAttempts, settings] = await Promise.all([
      prisma.courseCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { courses: { orderBy: { sortOrder: "asc" }, include: { _count: { select: { lessons: true } } } } } }),
      prisma.course.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.lesson.count({ where: { status: "PUBLISHED" } }),
      prisma.quizAttempt.count(),
      prisma.codeSubmission.findMany({ take: 12, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, challenge: { select: { titleAr: true, lesson: { select: { titleAr: true, course: { select: { titleAr: true } } } } } } } }),
      prisma.quizAttempt.findMany({ take: 30, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, lesson: { select: { titleAr: true, course: { select: { titleAr: true } } } } } }),
      prisma.siteSettings.upsert({ where: { id: "main" }, create: { id: "main" }, update: {} }),
    ]);
    const allCourses = await prisma.course.findMany({
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      include: {
        category: true,
        lessons: {
          orderBy: { sortOrder: "asc" },
          include: { quizQuestions: { orderBy: { sortOrder: "asc" } }, codeChallenges: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    return Response.json({
      stats: { categories: categories.length, courses, students, lessons, quizAttempts: attempts, codeSubmissions: await prisma.codeSubmission.count() },
      categories,
      courses: allCourses,
      submissions,
      attempts: recentAttempts,
      settings,
    });
  } catch {
    return Response.json({ error: "تعذر تحميل بيانات لوحة التحكم." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 }); }

  try {
    const entity = text(data.entity, 30);
    if (entity === "category") {
      const slug = text(data.slug, 80);
      const titleAr = text(data.titleAr, 120);
      const titleEn = text(data.titleEn, 120);
      if (!validSlug(slug) || !titleAr || !titleEn) return Response.json({ error: "أدخل رابطًا مختصرًا وعنوانًا بالعربية والإنجليزية." }, { status: 400 });
      const category = await prisma.courseCategory.create({ data: {
        slug, titleAr, titleEn, descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn),
        icon: text(data.icon, 12) || "📚", theme: text(data.theme, 30) || "code",
        sortOrder: Number(data.sortOrder) || 0, published: Boolean(data.published),
      } });
      return Response.json(category, { status: 201 });
    }

    if (entity === "course") {
      const slug = text(data.slug, 80);
      const titleAr = text(data.titleAr, 150);
      const titleEn = text(data.titleEn, 150);
      const categoryId = text(data.categoryId, 40);
      if (!validSlug(slug) || !titleAr || !titleEn || !categoryId) return Response.json({ error: "بيانات الكورس ناقصة أو الرابط المختصر غير صالح." }, { status: 400 });
      const course = await prisma.course.create({ data: {
        slug, titleAr, titleEn, categoryId, descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn),
        imageUrl: text(data.imageUrl, 500) || null, theme: text(data.theme, 30) || "code",
        status: contentStatuses.has(data.status as ContentStatus) ? data.status as ContentStatus : "DRAFT",
        sortOrder: Number(data.sortOrder) || 0,
      } });
      return Response.json(course, { status: 201 });
    }

    if (entity === "lesson") {
      const courseId = text(data.courseId, 40);
      const slug = text(data.slug, 80);
      const titleAr = text(data.titleAr, 150);
      const titleEn = text(data.titleEn, 150);
      if (!courseId || !validSlug(slug) || !titleAr || !titleEn) return Response.json({ error: "بيانات الدرس ناقصة أو الرابط المختصر غير صالح." }, { status: 400 });
      const lesson = await prisma.lesson.create({ data: {
        courseId, slug, titleAr, titleEn, descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn),
        videoUrl: text(data.videoUrl, 800) || null, transcript: text(data.transcript, 200000),
        sortOrder: Number(data.sortOrder) || 0, status: contentStatuses.has(data.status as ContentStatus) ? data.status as ContentStatus : "DRAFT",
      } });
      return Response.json(lesson, { status: 201 });
    }

    if (entity === "question") {
      const lessonId = text(data.lessonId, 40);
      const promptAr = text(data.promptAr, 2000);
      const promptEn = text(data.promptEn, 2000);
      if (!lessonId || !promptAr || !promptEn || !questionTypes.has(data.type as QuestionType)) return Response.json({ error: "اختر نوع السؤال وأدخل نصه بالعربية والإنجليزية." }, { status: 400 });
      const question = await prisma.quizQuestion.create({ data: {
        lessonId, type: data.type as QuestionType, promptAr, promptEn,
        options: safeJson(data.options), correctAnswers: safeJson(data.correctAnswers),
        explanationAr: text(data.explanationAr, 2000), explanationEn: text(data.explanationEn, 2000),
        points: Math.max(1, Math.min(100, Number(data.points) || 1)), sortOrder: Number(data.sortOrder) || 0,
      } });
      return Response.json(question, { status: 201 });
    }

    if (entity === "challenge") {
      const lessonId = text(data.lessonId, 40);
      const titleAr = text(data.titleAr, 150);
      const titleEn = text(data.titleEn, 150);
      if (!lessonId || !titleAr || !titleEn) return Response.json({ error: "أدخل عنوان التمرين بالعربية والإنجليزية." }, { status: 400 });
      const challenge = await prisma.codeChallenge.create({ data: {
        lessonId, titleAr, titleEn, promptAr: text(data.promptAr), promptEn: text(data.promptEn),
        starterCode: text(data.starterCode, 30000), language: "csharp", testCases: safeJson(data.testCases),
        sortOrder: Number(data.sortOrder) || 0,
      } });
      return Response.json(challenge, { status: 201 });
    }

    return Response.json({ error: "نوع المحتوى غير معروف." }, { status: 400 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "الرابط المختصر مستخدم بالفعل." }, { status: 409 });
    }
    return Response.json({ error: "تعذر حفظ المحتوى. راجع الحقول المطلوبة." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 }); }
  const id = text(data.id, 40);
  if (!id) return Response.json({ error: "معرّف المحتوى مطلوب." }, { status: 400 });
  const entity = text(data.entity, 30);
  try {
    if (entity === "category") return Response.json(await prisma.courseCategory.update({ where: { id }, data: {
      slug: text(data.slug, 80), titleAr: text(data.titleAr, 120), titleEn: text(data.titleEn, 120),
      descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn), icon: text(data.icon, 12),
      theme: text(data.theme, 30), sortOrder: Number(data.sortOrder) || 0, published: Boolean(data.published),
    } }));
    if (entity === "course") return Response.json(await prisma.course.update({ where: { id }, data: {
      categoryId: text(data.categoryId, 40), slug: text(data.slug, 80), titleAr: text(data.titleAr, 150), titleEn: text(data.titleEn, 150),
      descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn), imageUrl: text(data.imageUrl, 500) || null,
      theme: text(data.theme, 30), status: contentStatuses.has(data.status as ContentStatus) ? data.status as ContentStatus : "DRAFT",
      sortOrder: Number(data.sortOrder) || 0,
    } }));
    if (entity === "lesson") return Response.json(await prisma.lesson.update({ where: { id }, data: {
      courseId: text(data.courseId, 40), slug: text(data.slug, 80), titleAr: text(data.titleAr, 150), titleEn: text(data.titleEn, 150),
      descriptionAr: text(data.descriptionAr), descriptionEn: text(data.descriptionEn), videoUrl: text(data.videoUrl, 800) || null,
      transcript: text(data.transcript, 200000), sortOrder: Number(data.sortOrder) || 0,
      status: contentStatuses.has(data.status as ContentStatus) ? data.status as ContentStatus : "DRAFT",
    } }));
    if (entity === "question") return Response.json(await prisma.quizQuestion.update({ where: { id }, data: {
      type: questionTypes.has(data.type as QuestionType) ? data.type as QuestionType : "SINGLE_CHOICE",
      promptAr: text(data.promptAr, 2000), promptEn: text(data.promptEn, 2000), options: safeJson(data.options),
      correctAnswers: safeJson(data.correctAnswers), explanationAr: text(data.explanationAr, 2000),
      explanationEn: text(data.explanationEn, 2000), points: Math.max(1, Math.min(100, Number(data.points) || 1)),
      sortOrder: Number(data.sortOrder) || 0,
    } }));
    if (entity === "challenge") return Response.json(await prisma.codeChallenge.update({ where: { id }, data: {
      titleAr: text(data.titleAr, 150), titleEn: text(data.titleEn, 150), promptAr: text(data.promptAr), promptEn: text(data.promptEn),
      starterCode: text(data.starterCode, 30000), testCases: safeJson(data.testCases), sortOrder: Number(data.sortOrder) || 0,
    } }));
    if (entity === "attempt") {
      const attempt = await prisma.quizAttempt.findUnique({ where: { id }, select: { maxScore: true } });
      if (!attempt) return Response.json({ error: "المحاولة غير موجودة." }, { status: 404 });
      return Response.json(await prisma.quizAttempt.update({ where: { id }, data: { score: Math.max(0, Math.min(attempt.maxScore, Number(data.score) || 0)), needsReview: false } }));
    }
    if (entity === "settings") return Response.json(await prisma.siteSettings.update({ where: { id: "main" }, data: {
      homeTitleAr: text(data.homeTitleAr, 500), homeTitleEn: text(data.homeTitleEn, 500),
      homeDescriptionAr: text(data.homeDescriptionAr), homeDescriptionEn: text(data.homeDescriptionEn),
      aboutTextAr: text(data.aboutTextAr), aboutTextEn: text(data.aboutTextEn), footerTextAr: text(data.footerTextAr, 500), footerTextEn: text(data.footerTextEn, 500),
    } }));
    return Response.json({ error: "نوع المحتوى غير معروف." }, { status: 400 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return Response.json({ error: "المحتوى غير موجود." }, { status: 404 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return Response.json({ error: "الرابط المختصر مستخدم بالفعل." }, { status: 409 });
    return Response.json({ error: "تعذر تحديث المحتوى." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 }); }
  const id = text(data.id, 40);
  const entity = text(data.entity, 30);
  if (!id) return Response.json({ error: "معرّف المحتوى مطلوب." }, { status: 400 });
  try {
    const delegates: Record<string, { delete: (args: { where: { id: string } }) => Promise<unknown> }> = {
      category: prisma.courseCategory,
      course: prisma.course,
      lesson: prisma.lesson,
      question: prisma.quizQuestion,
      challenge: prisma.codeChallenge,
    };
    const delegate = delegates[entity];
    if (!delegate) return Response.json({ error: "نوع المحتوى غير معروف." }, { status: 400 });
    await delegate.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "تعذر حذف المحتوى." }, { status: 404 });
  }
}
