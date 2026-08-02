import type { BlockType } from "@/lib/models/site";

/**
 * Typed shapes for each block's `data` field. These mirror the seed shapes in
 * lib/blocks/defaults.ts and are the contract the renderers (Phase 3) and the
 * editors (Phase 4) both read. See docs/rbac-subsites-design.md §1/§4.
 *
 * Renderers cast the stored `Record<string, unknown>` to these; every field is
 * treated as best-effort (content is admin-authored), so renderers still guard
 * against missing arrays/strings.
 */

export interface HeroData {
  kicker: string;
  headline: string;
  subtext: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  details: string[];
}

export interface HighlightData {
  kicker: string;
  title: string;
  body: string;
  author: string;
  readTime: string;
  imageUrl: string;
  badge: string;
  linkLabel: string;
  linkHref: string;
}

export interface AboutStat {
  value: string;
  label: string;
}
export interface AboutData {
  kicker: string;
  title: string;
  paragraphs: string[];
  learnMoreLabel: string;
  learnMoreHref: string;
  stats: AboutStat[];
}

/**
 * Shape the FeaturedBlock renderer expects for each item — no longer authored
 * as part of block.data; built live by merging a site's featured Blog posts
 * and featured Events (same shared collections the main site uses) into one
 * mixed, date-sorted list. See lib/blocks/liveContent.ts's buildFeaturedItems.
 *
 * `kind` drives which icons/labels the renderer shows per card: line1/line2
 * are "author"/"read time" for a blog, "location"/"date" for an event.
 */
export interface FeaturedItem {
  kind: "blog" | "event";
  badge: string;
  title: string;
  excerpt: string;
  line1: string;
  line2: string;
  imageUrl: string;
}
export interface FeaturedData {
  kicker: string;
  title: string;
  viewAllLabel: string;
}

/**
 * Shape the EventsBlock renderer expects for each item — no longer authored
 * as part of block.data; mapped live from the shared `Event` collection
 * (same one the main site uses), filtered by site. See app/s/[slug]/page.tsx.
 */
export interface EventItem {
  place: string;
  title: string;
  description: string;
  time: string;
  date: string;
  imageUrl: string;
}
export interface EventsData {
  kicker: string;
  title: string;
  viewAllLabel: string;
}

/**
 * Shape the BlogBlock renderer expects for each item — no longer authored
 * as part of block.data; mapped live from the shared `Blog` collection
 * (same one the main site uses), filtered by site. See app/s/[slug]/page.tsx.
 */
export interface BlogPost {
  badge: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  read: string;
  imageUrl: string;
}
export interface BlogData {
  kicker: string;
  title: string;
  viewAllLabel: string;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}
export interface TeamData {
  kicker: string;
  title: string;
  viewAllLabel: string;
  members: TeamMember[];
}

export interface NewsletterData {
  kicker: string;
  title: string;
  body: string;
}

export interface ContactItem {
  label: string;
  value: string;
}
export interface ContactData {
  kicker: string;
  title: string;
  body: string;
  items: ContactItem[];
}

/** Maps each block type to the shape of its `data`. */
export interface BlockDataMap {
  hero: HeroData;
  highlight: HighlightData;
  about: AboutData;
  featured: FeaturedData;
  events: EventsData;
  blog: BlogData;
  team: TeamData;
  newsletter: NewsletterData;
  contact: ContactData;
}

export type BlockDataOf<T extends BlockType> = BlockDataMap[T];
