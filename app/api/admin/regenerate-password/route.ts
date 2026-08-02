import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { Site } from "@/lib/models/site";
import { AdminUser } from "@/lib/models/adminUser";
import { hashPassword, generatePassword } from "@/lib/auth/password";

/**
 * Regenerate a sub-site admin's password — superadmin-only, shown once
 * (design §2/§3: "generated on approval, shown once... regenerable by
 * superadmin"). Deliberately minimal: no separate "Sites" management tab
 * (not built — see project memory); this is wired directly into the
 * Chapters tab's approved rows, which already link 1:1 to a site.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!isSuperadmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { siteId } = await req.json();
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  await connectDB();
  const site = await Site.findById(siteId).select("slug adminUserId").exec();
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const admin = await AdminUser.findById(site.adminUserId).exec();
  if (!admin) {
    return NextResponse.json({ error: "Sub-site admin not found" }, { status: 404 });
  }

  const password = generatePassword();
  admin.passwordHash = await hashPassword(password);
  await admin.save();

  return NextResponse.json({
    username: admin.username,
    password,
    slug: site.slug,
    url: `/s/${site.slug}`,
  });
}
