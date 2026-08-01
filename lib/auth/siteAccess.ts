import { canEditSite, type SessionUser } from "./session";

/**
 * Resolve which site a caller may act on for a site-scoped mutation, or null
 * if forbidden/unspecified. Shared by /api/site/draft and /api/site/publish.
 *
 * Subadmins always operate on their own session.siteId. A siteId param is
 * accepted so a superadmin can target any site (the future "open builder as
 * this site" action) — every access still runs through canEditSite(), the
 * real fence (design §2 layer 3).
 */
export function resolveSiteId(user: SessionUser, requested: string | null): string | null {
  if (requested) return canEditSite(user, requested) ? requested : null;
  return user.siteId;
}

/** Shared 401/400/404 shape for the two "which site?" failure modes. */
export function siteAccessError(user: SessionUser) {
  return {
    error: user.role === "superadmin" ? "siteId is required" : "No site assigned",
    status: user.role === "superadmin" ? 400 : 404,
  } as const;
}
