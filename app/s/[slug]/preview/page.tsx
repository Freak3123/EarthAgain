import { notFound } from "next/navigation";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, canEditSite } from "@/lib/auth/session";
import { Site } from "@/lib/models/site";
import type { IBlock, ISiteSettings } from "@/lib/models/site";
import Blog from "@/lib/models/blogs";
import { Event } from "@/lib/models/events";
import SiteChrome from "@/components/subsite/SiteChrome";
import { BlockList, type BlockContext } from "@/lib/blocks/registry";
import { mapBlogsToPosts, mapEventsToItems, buildFeaturedItems } from "@/lib/blocks/liveContent";

/* -------------------------------------------------------------------------- */
/*  Draft preview — app/s/[slug]/preview (design §5).                          */
/*  Auth-gated: superadmin or the owning subadmin only; everyone else (incl.   */
/*  unauthenticated) gets 404, not 403 — a preview URL shouldn't leak whether  */
/*  a site exists to someone who can't view it (design NFR §4). Never cached.  */
/*                                                                             */
/*  Blog/Events blocks source the same live, site-scoped data as the live      */
/*  route (they're not part of draft/publish) — nothing to preview            */
/*  differently for those two block types specifically.                       */
/* -------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

type PageParams = { slug: string };

interface PreviewSiteView {
  _id: string;
  slug: string;
  status: "active" | "suspended";
  settings: ISiteSettings;
  draft: { blocks: IBlock[] };
}

async function getBlockContext(siteId: string, blocks: IBlock[]): Promise<BlockContext> {
  const needsFeatured = blocks.some((b) => b.type === "featured" && !b.hidden);
  const needsBlog = needsFeatured || blocks.some((b) => b.type === "blog" && !b.hidden);
  const needsEvents = needsFeatured || blocks.some((b) => b.type === "events" && !b.hidden);
  if (!needsBlog && !needsEvents) return {};

  const [blogs, events] = await Promise.all([
    needsBlog ? Blog.find({ siteIds: siteId }).sort({ date: -1 }).lean() : Promise.resolve([]),
    needsEvents ? Event.find({ siteIds: siteId }).sort({ date: -1 }).lean() : Promise.resolve([]),
  ]);

  return {
    blogPosts: mapBlogsToPosts(blogs as any),
    eventItems: mapEventsToItems(events as any),
    featuredItems: needsFeatured ? buildFeaturedItems(blogs as any, events as any) : undefined,
  };
}

export default async function SubSitePreviewPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  const user = await getSessionUser();
  if (!user) notFound();

  await connectDB();
  const site = await Site.findOne({ slug: slug.toLowerCase() })
    .select("slug status settings draft")
    .lean<PreviewSiteView>()
    .exec();

  if (!site || site.status === "suspended") notFound();
  if (!canEditSite(user, String(site._id))) notFound();

  const context = await getBlockContext(String(site._id), site.draft.blocks);

  return (
    <>
      <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-amber-950">
        Draft preview — not published
      </div>
      <SiteChrome settings={site.settings} blocks={site.draft.blocks}>
        <BlockList blocks={site.draft.blocks} context={context} />
      </SiteChrome>
    </>
  );
}
