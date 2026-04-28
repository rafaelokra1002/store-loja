import type { Session } from "next-auth";

export const FIXED_ADMIN_EMAIL = "okra1002@gmail.com";

export function isFixedAdminIdentity(identity?: {
  email?: string | null;
  role?: string | null;
}) {
  return identity?.email === FIXED_ADMIN_EMAIL && identity?.role === "ADMIN";
}

export function isFixedAdminSession(session: Session | null) {
  return isFixedAdminIdentity(session?.user);
}