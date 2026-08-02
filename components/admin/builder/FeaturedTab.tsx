"use client";
import axios from "axios";
import { Star, FileText, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, ListLoading, EmptyState, listCard } from "@/components/admin/shared";

interface FeaturedRow {
  _id: string;
  kind: "blog" | "event";
  title: string;
  date?: string;
}

/**
 * Combined view of this site's featured blog posts + events — the same
 * "featured" flag toggled from the Blog/Events tabs, just reviewed together
 * here. "Removing" an item un-features it (featured:false); the blog post or
 * event itself is untouched and still lives in its own tab.
 */
export default function FeaturedTab({
  blogs,
  events,
  loading,
  onRefresh,
}: {
  blogs: unknown;
  events: unknown;
  loading: boolean;
  onRefresh: () => Promise<void> | void;
}) {
  const blogRows: FeaturedRow[] = (Array.isArray(blogs) ? blogs : [])
    .filter((b: any) => b.featured)
    .map((b: any) => ({ _id: b._id, kind: "blog" as const, title: b.title, date: b.date }));
  const eventRows: FeaturedRow[] = (Array.isArray(events) ? events : [])
    .filter((e: any) => e.featured)
    .map((e: any) => ({ _id: e._id, kind: "event" as const, title: e.title, date: e.date }));

  const rows = [...blogRows, ...eventRows].sort(
    (a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
  );

  const unfeature = async (row: FeaturedRow) => {
    const endpoint = row.kind === "blog" ? "/api/admin/feature-blog" : "/api/admin/feature-event";
    try {
      await axios.patch(endpoint, { id: row._id, featured: false });
      await onRefresh();
    } catch {
      alert("Failed to update featured status.");
    }
  };

  return (
    <div>
      <SectionHeading title="Featured" count={rows.length} />
      {loading ? (
        <ListLoading />
      ) : rows.length === 0 ? (
        <EmptyState message="Nothing is featured yet — mark a blog post or event as featured from the Blog or Events tab." />
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const Icon = row.kind === "blog" ? FileText : CalendarDays;
            return (
              <div key={`${row.kind}-${row._id}`} className={listCard}>
                <div className="flex flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-lg font-bold text-stone-900">{row.title}</div>
                    <div className="mt-0.5 font-mono text-xs uppercase tracking-wide text-stone-500">
                      {row.kind}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 self-start border-amber-300 text-amber-700 hover:bg-amber-50 md:self-center"
                  onClick={() => unfeature(row)}
                >
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  Remove from Featured
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
