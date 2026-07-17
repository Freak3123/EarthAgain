"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogForm } from "../forms/BlogForm";
import {
  SectionHeading,
  SearchBar,
  ListLoading,
  EmptyState,
  SectionToggle,
  SectionMode,
  matches,
  listCard,
} from "../shared";

export function BlogsSection({
  blogs,
  loading,
  search,
  onSearch,
  onRefresh,
}: {
  blogs: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const count = Array.isArray(blogs) ? blogs.length : 0;
  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Blog"
      />
      {mode === "create" ? (
        <BlogForm />
      ) : (
        <div>
          <SectionHeading
            title="All Blogs"
            count={count}
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
                const arr = Array.isArray(blogs) ? blogs : [];
                if (loading) return <ListLoading />;
                if (arr.length === 0)
                  return <EmptyState message="No blogs found." />;
                const q = search.trim().toLowerCase();
                const shown = [...arr]
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
