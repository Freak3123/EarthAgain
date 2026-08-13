import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";
import BlogGallery from "@/components/BlogGallery";
import { sanitizeBlogHtml, isBlankHtml } from "@/lib/sanitizeHtml";

type UnwrappedParams = {
  id: string;
};

/** The excerpt doubles as the page's search and social preview text. */
export async function generateMetadata({
  params,
}: {
  params: Promise<UnwrappedParams>;
}): Promise<Metadata> {
  await connectDB();
  const { id } = await params;
  const blog = await Blog.findById(id).lean();
  if (!blog) return { title: "Article not found" };

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<UnwrappedParams> }) {
  await connectDB();

  // Await params first
  const unwrappedParams = await params;
  const { id } = unwrappedParams;

  const blog = await Blog.findById(id).lean();
  if (!blog) return notFound();

  // Sanitised again on the way out: posts saved before the editor existed
  // never went through the save-time pass.
  const content = sanitizeBlogHtml(blog.content);
  const images = (blog.images ?? []).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-20 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

      <div className="flex items-center flex-wrap gap-y-2 text-sm text-gray-500 mb-6 space-x-3">
        <span>By {blog.author}</span>
        <span>•</span>
        <span>{new Date(blog.date).toLocaleDateString()}</span>
        <span>•</span>
        <span>{blog.readTime}</span>
        <span>•</span>
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
          {blog.category}
        </span>
      </div>

      {blog.image && (
        <div className="relative w-full h-80 mb-8">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover rounded-xl shadow-md"
            priority
          />
        </div>
      )}

      {/* Standfirst — the same excerpt the card and the metadata use. */}
      {blog.excerpt && (
        <p className="mb-8 border-l-4 border-[#79b727] pl-4 text-lg sm:text-xl leading-relaxed text-gray-700">
          {blog.excerpt}
        </p>
      )}

      {isBlankHtml(content) ? (
        <p className="text-gray-500 italic">
          The full article has not been written yet.
        </p>
      ) : (
        <div
          className="blog-content max-w-none text-base sm:text-lg text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      <BlogGallery images={images} title={blog.title} />
    </div>
  );
}
