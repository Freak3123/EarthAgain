import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Site } from "@/lib/models/site";
import type { IBlock, ISiteSettings } from "@/lib/models/site";
import SiteChrome from "@/components/subsite/SiteChrome";
import ComingSoon from "@/components/subsite/ComingSoon";
import { BlockList } from "@/lib/blocks/registry";

/* -------------------------------------------------------------------------- */
/*  Public sub-site — app/s/[slug] (design §5).                                */
/*  Looks up the Site by slug, 404s when missing or suspended, renders only    */
/*  `published.blocks` (never the draft) — "Coming soon" until first publish.  */
/*  ISR-cached; POST /api/site/publish calls revalidatePath on this route.     */
/* -------------------------------------------------------------------------- */

// Safety-net revalidation on top of the explicit revalidatePath() a publish
// fires — keeps the page eventually-correct even if that call is ever missed.
export const revalidate = 3600;

type PageParams = { slug: string };

interface SiteView {
  slug: string;
  status: "active" | "suspended";
  settings: ISiteSettings;
  published: { blocks: IBlock[] } | null;
}

/** Fetch a renderable site by slug, or null if it should 404 (missing/suspended). */
async function getSite(slug: string): Promise<SiteView | null> {
  await connectDB();
  const site = await Site.findOne({ slug: slug.toLowerCase() })
    .select("slug status settings published")
    .lean<SiteView>()
    .exec();
  if (!site || site.status === "suspended") return null;
  return site;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return { title: "Not found · Earth Again" };
  const brand = site.settings?.brandName || "Sub-site";
  return {
    title: `${brand} · Earth Again`,
    description: site.settings?.tagline || undefined,
  };
}

export default async function SubSitePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();

  if (!site.published) {
    return (
      <SiteChrome settings={site.settings}>
        <ComingSoon brandName={site.settings?.brandName || "This site"} />
      </SiteChrome>
    );
  }

  return (
    <SiteChrome settings={site.settings} blocks={site.published.blocks}>
      <BlockList blocks={site.published.blocks} />
    </SiteChrome>
  );
}
