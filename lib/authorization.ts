import type { Role } from "@prisma/client";

export function isConfiguredAdmin(email?: string | null) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(configuredEmail && email?.trim().toLowerCase() === configuredEmail);
}

export function hasAdminRole(role?: Role | null, email?: string | null) {
  return role === "ADMIN" || isConfiguredAdmin(email);
}
