import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ lessonId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "سجّل الدخول لحفظ نتيجتك." }, { status: 401 });
  const { lessonId } = await context.params;
  let body: { answers?: Record<string, unknown> };
  try { body = await request.json(); } catch { return Response.json({ error: "الإجابات غير صالحة." }, { status: 400 }); }
  const lesson = await prisma.lesson.findFirst({ where: { id: lessonId, status: "PUBLISHED", course: { status: "PUBLISHED" } }, include: { quizQuestions: { orderBy: { sortOrder: "asc" } } } });
  if (!lesson) return Response.json({ error: "الدرس غير متاح." }, { status: 404 });
  let score = 0, maxScore = 0, needsReview = false;
  const feedback = lesson.quizQuestions.map((question) => {
    maxScore += question.points;
    const answer = body.answers?.[question.id];
    if (question.type === "LONG_ANSWER") { needsReview = true; return { questionId: question.id, needsReview: true }; }
    const actual: string[] = Array.isArray(answer) ? answer.map(String).sort() : answer == null ? [] : [String(answer)];
    const correct = Array.isArray(question.correctAnswers) ? question.correctAnswers.map(String).sort() : [];
    const isCorrect = actual.length === correct.length && actual.every((value, index) => value === correct[index]);
    if (isCorrect) score += question.points;
    return { questionId: question.id, correct: isCorrect, explanationAr: question.explanationAr };
  });
  const attempt = await prisma.quizAttempt.create({ data: { lessonId, userId: session.user.id, answers: (body.answers ?? {}) as Prisma.InputJsonValue, score, maxScore, needsReview } });
  return Response.json({ attemptId: attempt.id, score, maxScore, needsReview, feedback });
}
import { Prisma } from "@prisma/client";
