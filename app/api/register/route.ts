import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // أو حسب مسار ملف prisma عندك

export async function POST(req: Request) {
  try {
    console.log("1. تم استقبال الطلب بنجاح");
    
    const body = await req.json();
    console.log("2. البيانات المستلمة:", body);

    // اختبار الاتصال بالداتا بيز
    console.log("3. جاري الاتصال بقاعدة البيانات...");
    const userCount = await prisma.user.count(); 
    console.log("4. تم الاتصال بقاعدة البيانات! عدد المستخدمين الحاليين:", userCount);

    // ... باقي كود إنشاء المستخدم الخاص بك ...

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("❌ حدث خطأ دقيق هنا:", error);
    return NextResponse.json(
      { error: "There was an error while registering", details: String(error) },
      { status: 500 }
    );
  }
}