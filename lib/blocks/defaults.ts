import { randomUUID } from "crypto";
import type { IBlock, BlockType, ISiteSettings } from "@/lib/models/site";
import type { IChapter } from "@/lib/models/chapter";

/**
 * Default field data for each of the 9 template section block types.
 * Mirrors the placeholder content of app/template/page.tsx. These seed a
 * newly-approved site's draft; the Phase 4 block registry consumes the same
 * shapes for editing and the Phase 3 renderers for display.
 * See docs/rbac-subsites-design.md §1/§3.
 */

const placeholder =
  "This is placeholder text for the template. Replace it with your own content — a short description that tells visitors what this section is about.";

export const blockDefaultData: Record<BlockType, Record<string, unknown>> = {
  hero: {
    kicker: "Hero Section",
    headline: "A short, bold headline goes right here.",
    subtext: placeholder,
    primaryLabel: "Primary action",
    primaryHref: "#featured",
    secondaryLabel: "Secondary action",
    secondaryHref: "#about",
    details: ["Detail one", "Detail two", "Detail three"],
  },
  highlight: {
    kicker: "Highlight",
    title: "Highlight Section",
    body: placeholder,
    author: "Author name",
    readTime: "0 min read",
    imageUrl: "",
    badge: "Featured",
    linkLabel: "Continue reading",
    linkHref: "#featured",
  },
  about: {
    kicker: "About",
    title: "About Section",
    paragraphs: [placeholder, placeholder],
    learnMoreLabel: "Learn more",
    learnMoreHref: "#team",
    stats: [
      { value: "100+", label: "Metric one" },
      { value: "50", label: "Metric two" },
      { value: "12", label: "Metric three" },
      { value: "1,000", label: "Metric four" },
    ],
  },
  featured: {
    kicker: "Featured",
    title: "Featured Section",
    viewAllLabel: "View All",
    items: [
      { badge: "Category", title: "Featured item one", excerpt: placeholder, author: "Author name", meta: "5 min read", imageUrl: "" },
      { badge: "Category", title: "Featured item two", excerpt: placeholder, author: "Author name", meta: "6 min read", imageUrl: "" },
      { badge: "Category", title: "Featured item three", excerpt: placeholder, author: "Author name", meta: "4 min read", imageUrl: "" },
    ],
  },
  events: {
    kicker: "Events",
    title: "Events Section",
    viewAllLabel: "View All",
    items: [
      { place: "Location", title: "Event one", description: placeholder, time: "10:00 AM", date: "Month 00, 2026", imageUrl: "" },
      { place: "Location", title: "Event two", description: placeholder, time: "11:00 AM", date: "Month 00, 2026", imageUrl: "" },
      { place: "Location", title: "Event three", description: placeholder, time: "03:00 PM", date: "Month 00, 2026", imageUrl: "" },
    ],
  },
  blog: {
    kicker: "Blog",
    title: "Blog Section",
    viewAllLabel: "View All",
    posts: [
      { badge: "Category", title: "Blog post one", excerpt: placeholder, author: "Author name", date: "Jan 01", read: "5 min", imageUrl: "" },
      { badge: "Category", title: "Blog post two", excerpt: placeholder, author: "Author name", date: "Jan 02", read: "6 min", imageUrl: "" },
      { badge: "Category", title: "Blog post three", excerpt: placeholder, author: "Author name", date: "Jan 03", read: "4 min", imageUrl: "" },
    ],
  },
  team: {
    kicker: "Team",
    title: "Team Section",
    viewAllLabel: "View All",
    members: [
      { name: "Team member one", role: "Role / Title", imageUrl: "" },
      { name: "Team member two", role: "Role / Title", imageUrl: "" },
      { name: "Team member three", role: "Role / Title", imageUrl: "" },
      { name: "Team member four", role: "Role / Title", imageUrl: "" },
    ],
  },
  newsletter: {
    kicker: "Newsletter",
    title: "Newsletter Section",
    body: placeholder,
  },
  contact: {
    kicker: "Contact",
    title: "Contact Section",
    body: placeholder,
    items: [
      { label: "Email", value: "email@example.com" },
      { label: "Phone", value: "+00 000 000 0000" },
      { label: "Address", value: "123 Street, City" },
      { label: "Other", value: "@yourhandle" },
    ],
  },
};

/** The 9 section types in their default template order. */
export const defaultBlockOrder: BlockType[] = [
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

/** No border by default — an explicit admin opt-in, not a template look. */
export function defaultBlockStyle() {
  return { border: { enabled: false, color: "#16a34a", width: 2 } };
}

/** Build a fresh ordered block array for a newly-approved site. */
export function defaultBlocks(): IBlock[] {
  return defaultBlockOrder.map((type) => ({
    id: randomUUID(),
    type,
    hidden: false,
    data: structuredClone(blockDefaultData[type]),
    style: defaultBlockStyle(),
  }));
}

/** Seed site chrome from the approved chapter's details. */
export function defaultSettings(chapter: IChapter): ISiteSettings {
  const brandName =
    chapter.entityName || chapter.instituteName || chapter.name || "New Chapter";
  return {
    brandName,
    tagline: "Tagline goes here",
    logoUrl: "",
    accent: "#16a34a",
    nav: [
      { label: "About", href: "#about" },
      { label: "Featured", href: "#featured" },
      { label: "Events", href: "#events" },
      { label: "Blog", href: "#blog" },
      { label: "Team", href: "#team" },
      { label: "Contact", href: "#contact" },
    ],
    footer: {},
    socials: chapter.socialLink
      ? [{ platform: "link", url: chapter.socialLink }]
      : [],
  };
}
