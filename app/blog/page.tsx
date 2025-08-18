"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

   useEffect(() => {
    async function fetchSavedBlogs() {
      try {
        const res = await axios.get("/api/get-blogs");
        setArticles(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchSavedBlogs();
  }, []);

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
          <Badge className="bg-green-100 mt-8 text-green-800 hover:bg-green-200 mb-6">
            Earth Again Blog
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stories of <span className="text-green-600">Change</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
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
        <section className="py-10 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Article
              </h2>
            </div>

            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="relative h-96 lg:h-auto">
                  <Image
                    src={`${featuredArticle.image}`}
                    alt={featuredArticle.title}
                    width={600}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-green-600 text-white">Featured</Badge>
                  </div>
                </div>
                <CardContent className="p-8 lg:p-12">
                  <div className="mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {featuredArticle.category}
                    </Badge>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredArticle._id}`}>
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
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
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-gray-600">
                {filteredArticles.length} articles found
              </p>
            </div>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article) => (
              <Card
                key={article._id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`${article.image}`}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <Link href={`/blog/${article._id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
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
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
