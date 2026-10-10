import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/authorization";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !hasAdminRole(session.user.role, session.user.email)) {
    return { session: null, response: Response.json({ error: "غير مصرح بالدخول." }, { status: 403 }) };
  }
  return { session, response: null };
}
