import type { IBlog } from "@/lib/models/blogs";
import type { IEvent } from "@/lib/models/events";
import type { BlogPost, EventItem } from "./types";

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
