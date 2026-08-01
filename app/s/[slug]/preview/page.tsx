import { notFound } from "next/navigation";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, canEditSite } from "@/lib/auth/session";
import { Site } from "@/lib/models/site";
import type { IBlock, ISiteSettings } from "@/lib/models/site";
import SiteChrome from "@/components/subsite/SiteChrome";
import { BlockList } from "@/lib/blocks/registry";

/* -------------------------------------------------------------------------- */
/*  Draft preview — app/s/[slug]/preview (design §5).                          */
/*  Auth-gated: superadmin or the owning subadmin only; everyone else (incl.   */
/*  unauthenticated) gets 404, not 403 — a preview URL shouldn't leak whether  */
/*  a site exists to someone who can't view it (design NFR §4). Never cached.  */
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

  return (
    <>
      <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-amber-950">
        Draft preview — not published
      </div>
      <SiteChrome settings={site.settings} blocks={site.draft.blocks}>
        <BlockList blocks={site.draft.blocks} />
      </SiteChrome>
    </>
  );
}
