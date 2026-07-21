import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import type { AdminRole } from "@/lib/models/adminUser";

export interface SessionUser {
  id: string;
  role: AdminRole;
  siteId: string | null;
}

/** The logged-in admin, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) return null;
  return {
    id: session.user.id,
    role: session.user.role,
    siteId: session.user.siteId ?? null,
  };
}

/** True if the user is a superadmin. */
export function isSuperadmin(user: SessionUser | null): boolean {
  return user?.role === "superadmin";
}

/**
 * The core per-site ownership check (design §2, layer 3).
 * Superadmins pass for any site; subadmins only for their own siteId.
 * This is the real fence — call it in every sub-site mutation handler.
 */
export function canEditSite(
  user: SessionUser | null,
  targetSiteId: string
): boolean {
  if (!user) return false;
  if (user.role === "superadmin") return true;
  return user.siteId === targetSiteId;
}
