import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/authorization";
import { AdminDashboard } from "./dashboard-client";
import "./dashboard.css";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (!hasAdminRole(session.user.role, session.user.email)) {
    return <main className="admin-denied"><h1>هذه الصفحة للمدير فقط</h1><p>سجّل الدخول بحساب المدير المحدد في إعدادات الموقع.</p><Link href="/">العودة للرئيسية</Link></main>;
  }
  return <AdminDashboard name={session.user.name ?? "مدير الموقع"} />;
}
