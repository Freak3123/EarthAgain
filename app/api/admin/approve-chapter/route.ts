import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { Chapter } from "@/lib/models/chapter";
import { Site } from "@/lib/models/site";
import { AdminUser } from "@/lib/models/adminUser";
import { hashPassword, generatePassword } from "@/lib/auth/password";
import { slugify, isSlugAvailable, generateUniqueSlug } from "@/lib/utils/slug";
import { defaultBlocks, defaultSettings } from "@/lib/blocks/defaults";

/** Derive a unique AdminUser username from a base (usually the slug). */
async function uniqueUsername(base: string): Promise<string> {
  const root = slugify(base) || "admin";
  let candidate = root;
  let n = 2;
  while (await AdminUser.findOne({ username: candidate }).select("_id").lean().exec()) {
    candidate = `${root}-${n}`;
    n++;
  }
  return candidate;
}

export async function POST(req: Request) {
  const actor = await getSessionUser();
  if (!isSuperadmin(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const { chapterId, slug: requestedSlug } = await req.json();

  if (!chapterId) {
    return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  if (chapter.status === "approved") {
    return NextResponse.json(
      { error: "This chapter is already approved" },
      { status: 409 }
    );
  }

  // Resolve slug: honour a superadmin-supplied one (validated), else auto-generate.
  let slug: string;
  if (requestedSlug) {
    slug = slugify(requestedSlug);
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    if (!(await isSlugAvailable(slug))) {
      return NextResponse.json(
        { error: `The slug "${slug}" is already taken` },
        { status: 409 }
      );
    }
  } else {
    slug = await generateUniqueSlug(
      chapter.entityName || chapter.instituteName || chapter.name
    );
  }

  const username = await uniqueUsername(slug);
  const password = generatePassword();
  const passwordHash = await hashPassword(password);

  // No multi-doc transaction (standalone Mongo): create sequentially and roll
  // back the earlier writes if a later one fails, so we never half-provision.
  let createdUserId: string | null = null;
  let createdSiteId: string | null = null;
  try {
    const user = await AdminUser.create({
      username,
      passwordHash,
      role: "subadmin",
      siteId: null,
    });
    createdUserId = String(user._id);

    const site = await Site.create({
      slug,
      status: "active",
      chapterId: chapter._id,
      adminUserId: user._id,
      settings: defaultSettings(chapter),
      draft: { blocks: defaultBlocks() },
      published: null,
      publishedAt: null,
    });
    createdSiteId = String(site._id);

    user.siteId = site._id;
    await user.save();

    chapter.status = "approved";
    chapter.siteId = site._id;
    await chapter.save();

    return NextResponse.json({
      success: true,
      credentials: { username, password },
      slug,
      url: `/s/${slug}`,
    });
  } catch (error: any) {
    // Best-effort cleanup.
    if (createdSiteId) await Site.findByIdAndDelete(createdSiteId).catch(() => {});
    if (createdUserId) await AdminUser.findByIdAndDelete(createdUserId).catch(() => {});
    console.error("approve-chapter error:", error);
    return NextResponse.json(
      { error: "Failed to approve chapter" },
      { status: 500 }
    );
  }
}
