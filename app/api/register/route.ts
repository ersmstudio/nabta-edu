import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type RegistrationBody = { name?: unknown; email?: unknown; password?: unknown };

export async function POST(request: Request) {
  let body: RegistrationBody;

  try {
    body = (await request.json()) as RegistrationBody;
  } catch {
    return NextResponse.json({ error: "صيغة الطلب غير صالحة." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "اكتب اسمًا بين حرفين و80 حرفًا." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "اكتب بريدًا إلكترونيًا صالحًا." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "يجب أن تكون كلمة المرور بين 8 و128 حرفًا." }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });
    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح." }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "هذا البريد مسجل بالفعل." }, { status: 409 });
    }

    console.error("Registration failed");
    return NextResponse.json({ error: "تعذر إنشاء الحساب الآن. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
