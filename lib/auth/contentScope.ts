import mongoose from "mongoose";
import { Site } from "@/lib/models/site";
import type { SessionUser } from "./session";

export interface ContentScope {
  siteIds: mongoose.Types.ObjectId[];
  showOnMainSite: boolean;
}

/**
 * Resolve the site-distribution fields for a new/edited Blog or Event,
 * enforced server-side regardless of what the client sent — the real fence,
 * matching the pattern in lib/auth/siteAccess.ts for the sub-site builder.
 *
 * Superadmins may broadcast to Main Site + any active sub-site(s) they pick.
 * Subadmins are always pinned to exactly their own site, never the main site
 * or anyone else's — the client UI hides the selector for them, but this is
 * what actually prevents a crafted request from escaping that scope.
 */
export async function resolveContentScope(
  user: SessionUser,
  requested: { siteIds?: unknown; showOnMainSite?: unknown }
): Promise<ContentScope> {
  if (user.role === "subadmin") {
    if (!user.siteId) return { siteIds: [], showOnMainSite: false };
    return { siteIds: [new mongoose.Types.ObjectId(user.siteId)], showOnMainSite: false };
  }

  const requestedIds = Array.isArray(requested.siteIds)
    ? requested.siteIds.filter((id): id is string => typeof id === "string" && mongoose.isValidObjectId(id))
    : [];

  let siteIds: mongoose.Types.ObjectId[] = [];
  if (requestedIds.length > 0) {
    const valid = await Site.find({ _id: { $in: requestedIds }, status: "active" })
      .select("_id")
      .lean()
      .exec();
    siteIds = valid.map((s: any) => s._id);
  }

  const showOnMainSite =
    typeof requested.showOnMainSite === "boolean"
      ? requested.showOnMainSite
      : requested.showOnMainSite === "true"
      ? true
      : requested.showOnMainSite === "false"
      ? false
      : true; // default preserves pre-feature behavior when the field is omitted

  return { siteIds, showOnMainSite };
}
