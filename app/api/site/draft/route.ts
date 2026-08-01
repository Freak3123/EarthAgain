import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { resolveSiteId, siteAccessError } from "@/lib/auth/siteAccess";
import { Site, type BlockType, type IBlock, type ISiteSettings } from "@/lib/models/site";

interface DraftGetView {
  _id: string;
  slug: string;
  status: "active" | "suspended";
  settings: ISiteSettings;
  draft: { blocks: IBlock[] };
  published: { blocks: IBlock[] } | null;
  publishedAt: Date | null;
}

interface DraftPutView {
  settings: ISiteSettings;
  draft: { blocks: IBlock[] };
  updatedAt: Date;
}

/**
 * Draft read/write for the sub-site builder (design §4/§6, Phase 4).
 * Publish (draft.blocks -> published.blocks) is a separate endpoint, Phase 5
 * (app/api/site/publish/route.ts).
 */

function isValidBlockShape(b: unknown): b is { id: string; type: BlockType; hidden: boolean; data: unknown } {
  if (!b || typeof b !== "object") return false;
  const rec = b as Record<string, unknown>;
  return (
    typeof rec.id === "string" &&
    typeof rec.type === "string" &&
    typeof rec.hidden === "boolean" &&
    typeof rec.data === "object" &&
    rec.data !== null
  );
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const siteId = resolveSiteId(user, searchParams.get("siteId"));
  if (!siteId) {
    const { error, status } = siteAccessError(user);
    return NextResponse.json({ error }, { status });
  }

  await connectDB();
  const site = await Site.findById(siteId)
    .select("slug status settings draft published publishedAt")
    .lean<DraftGetView>()
    .exec();
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({
    siteId: String(site._id),
    slug: site.slug,
    status: site.status,
    settings: site.settings,
    blocks: site.draft.blocks,
    hasPublished: site.published !== null,
    publishedAt: site.publishedAt,
  });
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const siteId = resolveSiteId(user, body.siteId ?? null);
  if (!siteId) {
    const { error, status } = siteAccessError(user);
    return NextResponse.json({ error }, { status });
  }

  const update: Record<string, unknown> = {};

  if (body.blocks !== undefined) {
    if (!Array.isArray(body.blocks) || !body.blocks.every(isValidBlockShape)) {
      return NextResponse.json({ error: "Invalid blocks payload" }, { status: 400 });
    }
    update["draft.blocks"] = body.blocks;
  }

  if (body.settings !== undefined) {
    if (typeof body.settings !== "object" || body.settings === null) {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }
    update.settings = body.settings;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await connectDB();
  const site = await Site.findByIdAndUpdate(siteId, { $set: update }, { new: true })
    .select("slug settings draft updatedAt")
    .lean<DraftPutView>()
    .exec();
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({
    success: true,
    settings: site.settings,
    blocks: site.draft.blocks,
    updatedAt: site.updatedAt,
  });
}
