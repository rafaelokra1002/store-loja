import type { Session } from "next-auth";

export function isAdminIdentity(identity?: {
  email?: string | null;
  role?: string | null;
}) {
  return identity?.role === "ADMIN";
}

export function isAdminSession(session: Session | null) {
  return isAdminIdentity(session?.user);
}