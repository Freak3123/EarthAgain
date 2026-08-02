import type { ComponentType } from "react";
import {
  Sparkles,
  Star,
  Info,
  Newspaper,
  CalendarDays,
  BookOpen,
  Users,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { BlockType, IBlock } from "@/lib/models/site";
import type { BlogPost, EventItem, FeaturedItem } from "./types";
import { blockDefaultData } from "./defaults";

import HeroBlock from "@/components/subsite/blocks/HeroBlock";
import HighlightBlock from "@/components/subsite/blocks/HighlightBlock";
import AboutBlock from "@/components/subsite/blocks/AboutBlock";
import FeaturedBlock from "@/components/subsite/blocks/FeaturedBlock";
import EventsBlock from "@/components/subsite/blocks/EventsBlock";
import BlogBlock from "@/components/subsite/blocks/BlogBlock";
import TeamBlock from "@/components/subsite/blocks/TeamBlock";
import NewsletterBlock from "@/components/subsite/blocks/NewsletterBlock";
import ContactBlock from "@/components/subsite/blocks/ContactBlock";

import HeroEditor from "@/components/admin/builder/editors/HeroEditor";
import HighlightEditor from "@/components/admin/builder/editors/HighlightEditor";
import AboutEditor from "@/components/admin/builder/editors/AboutEditor";
import FeaturedEditor from "@/components/admin/builder/editors/FeaturedEditor";
import EventsEditor from "@/components/admin/builder/editors/EventsEditor";
import BlogEditor from "@/components/admin/builder/editors/BlogEditor";
import TeamEditor from "@/components/admin/builder/editors/TeamEditor";
import NewsletterEditor from "@/components/admin/builder/editors/NewsletterEditor";
import ContactEditor from "@/components/admin/builder/editors/ContactEditor";

/**
 * The block registry — one source of truth mapping each section type to how it
 * renders, how it's edited, its seed data, and its display label/icon for the
 * builder chrome. Editor (Phase 4) and public render (Phase 3) read from here
 * so they never drift (design §4/§9 decision 9). Adding a new section type
 * later is one entry here + one in defaults.ts.
 */

// Renderers/editors accept their own typed `data`; the registry erases the
// specific shape so entries can live in one map. Call sites re-supply
// block.data, which is safe because each entry's data always matches its type.
type Renderer = ComponentType<{ data: never }>;
type Editor = ComponentType<{ data: never; onChange: (data: never) => void }>;

interface BlockEntry {
  label: string;
  description: string;
  icon: LucideIcon;
  renderer: Renderer;
  editor: Editor;
  defaultData: Record<string, unknown>;
}

export const blockRegistry: Record<BlockType, BlockEntry> = {
  hero: {
    label: "Hero",
    description: "Headline banner at the top of the page",
    icon: Sparkles,
    renderer: HeroBlock as Renderer,
    editor: HeroEditor as unknown as Editor,
    defaultData: blockDefaultData.hero,
  },
  highlight: {
    label: "Highlight",
    description: "Single featured story with an image",
    icon: Star,
    renderer: HighlightBlock as Renderer,
    editor: HighlightEditor as unknown as Editor,
    defaultData: blockDefaultData.highlight,
  },
  about: {
    label: "About",
    description: "Org description and key stats",
    icon: Info,
    renderer: AboutBlock as Renderer,
    editor: AboutEditor as unknown as Editor,
    defaultData: blockDefaultData.about,
  },
  featured: {
    label: "Featured",
    description: "Grid of featured items",
    icon: Newspaper,
    renderer: FeaturedBlock as Renderer,
    editor: FeaturedEditor as unknown as Editor,
    defaultData: blockDefaultData.featured,
  },
  events: {
    label: "Events",
    description: "Upcoming events grid",
    icon: CalendarDays,
    renderer: EventsBlock as Renderer,
    editor: EventsEditor as unknown as Editor,
    defaultData: blockDefaultData.events,
  },
  blog: {
    label: "Blog",
    description: "Blog post grid",
    icon: BookOpen,
    renderer: BlogBlock as Renderer,
    editor: BlogEditor as unknown as Editor,
    defaultData: blockDefaultData.blog,
  },
  team: {
    label: "Team",
    description: "Team member grid",
    icon: Users,
    renderer: TeamBlock as Renderer,
    editor: TeamEditor as unknown as Editor,
    defaultData: blockDefaultData.team,
  },
  newsletter: {
    label: "Newsletter",
    description: "Email signup band",
    icon: Mail,
    renderer: NewsletterBlock as Renderer,
    editor: NewsletterEditor as unknown as Editor,
    defaultData: blockDefaultData.newsletter,
  },
  contact: {
    label: "Contact",
    description: "Contact details grid",
    icon: Phone,
    renderer: ContactBlock as Renderer,
    editor: ContactEditor as unknown as Editor,
    defaultData: blockDefaultData.contact,
  },
};

/** The palette order used by "+ Add section" (mirrors the default template order). */
export const blockTypeOrder: BlockType[] = [
  "hero",
  "highlight",
  "about",
  "featured",
  "events",
  "blog",
  "team",
  "newsletter",
  "contact",
];

/**
 * Live data injected into "blog"/"events"/"featured" blocks at render time —
 * sourced from the shared Blog/Event collections (same system as the main
 * site), filtered to the current site, rather than authored in block.data.
 * See app/s/[slug]/page.tsx, which fetches and maps this before rendering.
 */
export interface BlockContext {
  blogPosts?: BlogPost[];
  eventItems?: EventItem[];
  featuredItems?: FeaturedItem[];
}

/** Render one block, or null for an unknown type (forward-compatible). */
export function renderBlock(block: IBlock, context?: BlockContext) {
  const entry = blockRegistry[block.type];
  if (!entry) return null;
  const Renderer = entry.renderer;

  let data: unknown = block.data;
  if (block.type === "blog") data = { ...block.data, posts: context?.blogPosts ?? [] };
  if (block.type === "events") data = { ...block.data, items: context?.eventItems ?? [] };
  if (block.type === "featured") data = { ...block.data, items: context?.featuredItems ?? [] };

  const rendered = <Renderer data={data as never} />;

  // Section border is a cross-cutting presentation option, not block content
  // — applied once here rather than duplicated in every renderer. Absent on
  // blocks created before this field existed (see IBlock.style JSDoc).
  const border = block.style?.border;
  if (!border?.enabled) return <div key={block.id}>{rendered}</div>;

  return (
    <div
      key={block.id}
      style={{ border: `${border.width}px solid ${border.color}` }}
    >
      {rendered}
    </div>
  );
}

/** Render an ordered block array, skipping hidden blocks. */
export function BlockList({ blocks, context }: { blocks: IBlock[]; context?: BlockContext }) {
  return <>{blocks.filter((b) => !b.hidden).map((b) => renderBlock(b, context))}</>;
}
