"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogForm } from "../forms/BlogForm";
import SiteFilterSelect, { SiteFilterValue, matchesSiteFilter } from "../SiteFilterSelect";
import {
  SectionHeading,
  SearchBar,
  ListLoading,
  EmptyState,
  SectionToggle,
  SectionMode,
  matches,
  listCard,
  PeriodToggle,
  PeriodView,
  DeleteAllOlderButton,
  isOlderThanCutoff,
  CUTOFF_YEAR,
} from "../shared";

export function BlogsSection({
  blogs,
  loading,
  search,
  onSearch,
  onRefresh,
  formMode = "admin",
  showSiteFilter = true,
  allowBulkDelete = true,
}: {
  blogs: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
  /** "site" hides the distribution selector in the create form — used inside the sub-site builder. */
  formMode?: "admin" | "site";
  /** Hide the All/Main-Site/sub-site scope filter — pointless when the list is already one site's own. */
  showSiteFilter?: boolean;
  /** Hide the unscoped bulk "delete everything older" action — superadmin-console only. */
  allowBulkDelete?: boolean;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const [view, setView] = useState<PeriodView>("new");
  const [siteFilter, setSiteFilter] = useState<SiteFilterValue>("all");
  const count = Array.isArray(blogs) ? blogs.length : 0;

  const handleDeleteAllOlder = async () => {
    await axios.post("/api/admin/delete-blogs", {});
    await onRefresh();
    setView("new");
  };

  const handleSaved = () => {
    setMode("manage");
    onRefresh();
  };

  const arr = Array.isArray(blogs) ? blogs : [];
  const scoped = showSiteFilter ? arr.filter((b: any) => matchesSiteFilter(b, siteFilter)) : arr;
  const newArr = scoped.filter((e: any) => !isOlderThanCutoff(e.date));
  const olderArr = scoped.filter((e: any) => isOlderThanCutoff(e.date));
  const base = view === "older" ? olderArr : newArr;

  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Blog"
      />
      {mode === "create" ? (
        <BlogForm mode={formMode} onSaved={handleSaved} />
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <PeriodToggle
              view={view}
              onView={setView}
              newCount={newArr.length}
              olderCount={olderArr.length}
            />
            <div className="flex items-center gap-3">
              {showSiteFilter && (
                <SiteFilterSelect value={siteFilter} onChange={setSiteFilter} />
              )}
              {allowBulkDelete && view === "older" && olderArr.length > 0 && (
                <DeleteAllOlderButton onDeleteAll={handleDeleteAllOlder} />
              )}
            </div>
          </div>
          <SectionHeading
            title="All Blogs"
            count={scoped.length}
            right={
              count > 0 ? (
                <SearchBar
                  value={search}
                  onChange={onSearch}
                  placeholder="Search blogs…"
                />
              ) : undefined
            }
          />
          {(() => {
            if (loading) return <ListLoading />;
            if (arr.length === 0)
              return <EmptyState message="No blogs found." />;
            if (base.length === 0)
              return (
                <EmptyState
                  message={
                    view === "older"
                      ? `No blogs published before ${CUTOFF_YEAR}.`
                      : `No blogs published from ${CUTOFF_YEAR} onward.`
                  }
                />
              );
            const q = search.trim().toLowerCase();
            const shown = [...base]
              .filter((e: any) =>
                matches(q, [e.title, e.author, e.category, e.excerpt])
              )
              .sort(
                (a, b) =>
                  new Date(b.date ?? "").getTime() -
                  new Date(a.date ?? "").getTime()
              );
            if (shown.length === 0)
              return (
                <EmptyState message={`No blogs match “${search}”.`} />
              );
            return (
              <div className="space-y-4">
                {shown.map(
                  (
                    blog: {
                      _id?: string;
                      title: string;
                      excerpt: string;
                      author: string;
                      date?: string;
                      readTime: string;
                      category: string;
                      image?: string;
                    },
                    idx: number
                  ) => (
                    <div key={blog._id || idx} className={listCard}>
                      <div className="flex-1">
                        {/* Blog Title */}
                        <div className="text-lg font-bold text-stone-900">
                          {blog.title}
                        </div>

                        {/* Blog Meta Info */}
                        <div className="mt-1 font-mono text-xs text-stone-500">
                          {blog.date
                            ? new Date(blog.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : ""}
                          {" • "}
                          {blog.readTime}
                          {" • "}
                          {blog.category}
                          {" • "}
                          By {blog.author}
                        </div>
                      </div>

                      {/* Blog Image (if exists) */}
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-20 w-32 rounded-lg object-cover"
                        />
                      )}

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1.5 self-start md:self-center"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete "${blog.title}"?`
                            )
                          ) {
                            try {
                              await axios.delete("/api/admin/delete-blogs", {
                                data: { id: blog._id },
                              });

                              await onRefresh();
                            } catch (err) {
                              alert("Failed to delete blog.");
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
