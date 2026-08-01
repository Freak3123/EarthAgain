import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { resolveSiteId, siteAccessError } from "@/lib/auth/siteAccess";
import { Site } from "@/lib/models/site";

/**
 * Publish — atomically copies draft.blocks -> published.blocks and stamps
 * publishedAt (design §5). The live route always reads `published`, so this
 * is the only thing that makes edits visible to the public. Revalidates the
 * live path so the next request reflects the change immediately even though
 * the live page is ISR-cached.
 */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const siteId = resolveSiteId(user, body.siteId ?? null);
  if (!siteId) {
    const { error, status } = siteAccessError(user);
    return NextResponse.json({ error }, { status });
  }

  await connectDB();
  const site = await Site.findById(siteId).select("slug draft").exec();
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const publishedAt = new Date();
  site.published = { blocks: site.draft.blocks };
  site.publishedAt = publishedAt;
  await site.save();

  revalidatePath(`/s/${site.slug}`);

  return NextResponse.json({ success: true, publishedAt });
}
