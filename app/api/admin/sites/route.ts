import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { Site } from "@/lib/models/site";

/**
 * Lightweight active-site list — NOT the full "Sites management" tab from the
 * design doc (deliberately not built; see project memory). Superadmin-only,
 * used to populate the "which sub-sites should this also appear on" selector
 * on Blog/Event forms and the site filter on the Blog/Events admin lists.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!isSuperadmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const sites = await Site.find({ status: "active" })
    .select("slug settings.brandName")
    .sort({ "settings.brandName": 1 })
    .lean()
    .exec();

  return NextResponse.json(
    sites.map((s: any) => ({
      _id: String(s._id),
      slug: s.slug,
      brandName: s.settings?.brandName || s.slug,
    }))
  );
}
