"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LoaderComp from "@/components/LoaderComp";
import {
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

type Article = {
  _id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

   useEffect(() => {
    async function fetchSavedBlogs() {
      try {
        const res = await axios.get("/api/get-blogs");
        setArticles(res.data);
        console.log(res.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchSavedBlogs();
  }, []);
  if(isLoading){
  return(
    <div className="min-h-screen flex justify-center items-center">
      <LoaderComp />
    </div>
  )}

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory ||
      filterCategory === "All Categories" ||
      article.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.find((article) => article.featured);
  const otherArticles = filteredArticles.filter((article) => !article.featured);

  

  return (
    <div className="min-h-screen bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="pt-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* <Badge className="bg-green-100 mt-8 text-green-800 hover:bg-green-200 mb-6">
            Earth Again Blog
          </Badge> */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Stories of <span className="text-[#79b727]">Change</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12">
            Discover insights, success stories, and expert knowledge about
            sustainability, climate action, and environmental conservation in
            Odisha and beyond.
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative md:col-span-3 bg-white">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-5 border-green-600 placeholder:text-base placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-8 sm:py-10 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Article
              </h2>
            </div>

            <Card className="border-0 rounded-sm py-0 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-56 sm:h-96 lg:h-auto">
                  <Image
                    src={`${featuredArticle.image}`}
                    alt={featuredArticle.title}
                    width={600}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-[#79b727] text-white">Featured</Badge>
                  </div>
                </div>
                <CardContent className="p-6 text-left sm:p-8 lg:p-12">
                  <div className="mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {featuredArticle.category}
                    </Badge>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-sm text-gray-500 mb-6 sm:mb-8">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredArticle.date.slice(0,10)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredArticle._id}`}
                    className="block w-full sm:inline-block sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#79b727] hover:bg-[#338c20]"
                    >
                      Read Full Article <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Latest Articles
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                {filteredArticles.length} articles found
              </p>
            </div>
            {/* <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button> */}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
            {/* The whole card is the link — a phone tile has no room for a
                "Read More" button, and the button was the only target before. */}
            {otherArticles.map((article) => (
              <Link
                key={article._id}
                href={`/blog/${article._id}`}
                className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79b727] focus-visible:ring-offset-2"
              >
                <Card className="h-full border-0 rounded-sm pt-0 pb-2 sm:pb-6 gap-2 sm:gap-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                    <Image
                      src={`${article.image}`}
                      alt={article.title}
                      width={400}
                      height={200}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="hidden sm:block absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="px-2 sm:px-6 py-0 pb-0 sm:pb-2 text-left">
                    <h3 className="text-xs leading-tight line-clamp-2 sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-3 group-hover:text-[#79b727] transition-colors">
                      {article.title}
                    </h3>
                    {/* No location on an article, so read time takes the
                        second line the other routes give to the map pin. */}
                    <div className="sm:hidden space-y-0.5 text-[11px] leading-tight text-gray-500">
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {article.date.slice(0, 10)}
                        </span>
                      </p>
                      {article.readTime && (
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate">{article.readTime}</span>
                        </p>
                      )}
                    </div>
                    <p className="hidden sm:block text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.date.slice(0, 10)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Styled as the button it replaces, but a span — the whole
                        card is already an anchor and nesting one is invalid. */}
                    <span className="hidden sm:inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#79b727] px-4 py-2 text-sm font-medium text-[#338c20] transition-colors group-hover:bg-green-50">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No articles found matching your criteria. Try adjusting your
                search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8 bg-[#79b727] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Stay Updated
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Subscribe to our newsletter and never miss the latest insights,
            stories, and updates from the Earth Again movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-[#338c20] hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
