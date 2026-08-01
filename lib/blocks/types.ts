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

export interface FeaturedItem {
  badge: string;
  title: string;
  excerpt: string;
  author: string;
  meta: string;
  imageUrl: string;
}
export interface FeaturedData {
  kicker: string;
  title: string;
  viewAllLabel: string;
  items: FeaturedItem[];
}

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
  items: EventItem[];
}

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
  posts: BlogPost[];
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
