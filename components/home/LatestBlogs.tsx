"use client";

import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import axios from "axios";
import { pickFeaturedFirst } from "@/lib/featuredFirst";

interface BlogProps {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

/**
 * Home-page blog teaser, the counterpart to UpcomingEvents: the same section
 * shell and card grid, reading the same shared Blog collection the /blog page
 * does. `/api/get-blogs` already withholds sub-site-exclusive posts from
 * public visitors, so nothing extra is filtered here.
 */
export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get("/api/get-blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load articles.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();

    // Track window resize
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Narrow viewports fit two cards, wide ones three — matching the events row.
  const cardCount = windowWidth < 1024 ? 2 : 3;

  // Featured posts first, topped up with the most recent of the rest, then the
  // whole row ordered by date. Same rule as the events section above it.
  const displayedBlogs = useMemo(
    () => pickFeaturedFirst(blogs, cardCount),
    [blogs, cardCount]
  );

  if (isLoading) return <p className="text-center py-8">Loading articles...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;

  // With nothing published there is no row to show, and a bare heading over an
  // empty grid reads as broken — so the section stands down entirely.
  if (!displayedBlogs.length) return null;

  return (
    <section className="bg-white text-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Stories of Change</h2>
          <Link href="/blog">
            <Button
              variant={"default"}
              className="bg-transparent shadow-none border-0 text-[#A22D10] hover:text-amber-950 hover:bg-transparent"
            >
              View All Articles <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayedBlogs.map((blog) => (
            // The whole card is the link, as on the /blog grid — a phone tile
            // has no room for a separate "Read More" target.
            <Link
              key={blog._id}
              href={`/blog/${blog._id}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79b727] focus-visible:ring-offset-2"
            >
              <Card className="h-full bg-white text-black rounded-lg overflow-hidden flex flex-col pb-2 mb-2 p-0 border-0 shadow-xl">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={
                      blog.image ||
                      "https://plus.unsplash.com/premium_photo-1712685912274-2483dade540f?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {blog.category && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="backdrop-blur-md bg-black/50 text-white text-sm px-3 py-1 rounded shadow">
                        {blog.category}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="pb-6">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2 group-hover:text-[#79b727] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {blog.readTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>{blog.readTime}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>
                          {new Date(blog.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
