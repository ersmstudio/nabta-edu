import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Please enter your email and password" }, { status: 400 })
    }

    // التحقق من وجود المستخدم سابقاً
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "The email is already registered" }, { status: 400 })
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    // إنشاء المستخدم في قاعدة البيانات على السيرفر
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    })

    return NextResponse.json({ message: "Account is created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "There was an error while registering" }, { status: 500 })
  }
}