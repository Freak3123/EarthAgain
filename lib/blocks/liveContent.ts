import type { IBlog } from "@/lib/models/blogs";
import type { IEvent } from "@/lib/models/events";
import type { BlogPost, EventItem, FeaturedItem } from "./types";

/**
 * Maps the shared Blog/Event collections (same system as the main site) into
 * the shapes the sub-site's BlogBlock/EventsBlock renderers expect. Used by
 * app/s/[slug]/page.tsx and preview/page.tsx to build a BlockContext.
 */

const shortDate = (d: unknown) => {
  const date = new Date(d as string | Date);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

export function mapBlogsToPosts(blogs: Pick<IBlog, "title" | "excerpt" | "author" | "date" | "readTime" | "category" | "image">[]): BlogPost[] {
  return blogs.map((b) => ({
    badge: b.category,
    title: b.title,
    excerpt: b.excerpt,
    author: b.author,
    date: shortDate(b.date),
    read: b.readTime,
    imageUrl: b.image,
  }));
}

export function mapEventsToItems(events: Pick<IEvent, "title" | "description" | "time" | "date" | "location" | "image">[]): EventItem[] {
  return events.map((e) => ({
    place: e.location,
    title: e.title,
    description: e.description,
    time: e.time,
    date: shortDate(e.date),
    imageUrl: e.image,
  }));
}

type FeaturedBlogSource = Pick<IBlog, "title" | "excerpt" | "author" | "date" | "readTime" | "category" | "image" | "featured">;
type FeaturedEventSource = Pick<IEvent, "title" | "description" | "time" | "date" | "location" | "image" | "featured">;

/**
 * The Featured section's live list — featured blog posts and featured events
 * merged into one array, most recent first. Only the "featured"-flagged
 * subset of each (same collections BlogBlock/EventsBlock read from).
 */
export function buildFeaturedItems(blogs: FeaturedBlogSource[], events: FeaturedEventSource[]): FeaturedItem[] {
  const fromBlogs: (FeaturedItem & { sortDate: number })[] = blogs
    .filter((b) => b.featured)
    .map((b) => ({
      kind: "blog" as const,
      badge: b.category,
      title: b.title,
      excerpt: b.excerpt,
      line1: b.author,
      line2: b.readTime,
      imageUrl: b.image,
      sortDate: new Date(b.date).getTime() || 0,
    }));

  const fromEvents: (FeaturedItem & { sortDate: number })[] = events
    .filter((e) => e.featured)
    .map((e) => ({
      kind: "event" as const,
      badge: "Event",
      title: e.title,
      excerpt: e.description,
      line1: e.location,
      line2: shortDate(e.date),
      imageUrl: e.image,
      sortDate: new Date(e.date).getTime() || 0,
    }));

  return [...fromBlogs, ...fromEvents]
    .sort((a, b) => b.sortDate - a.sortDate)
    .map(({ sortDate, ...item }) => item);
}
