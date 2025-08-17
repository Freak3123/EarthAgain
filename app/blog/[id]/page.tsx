import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";

type UnwrappedParams = {
  id: string;
};

export default async function BlogPage({ params }: { params: Promise<UnwrappedParams> }) {
  await connectDB();

  // Await params first
  const unwrappedParams = await params;
  const { id } = unwrappedParams;

  const blog = await Blog.findById(id).lean();
  if (!blog) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 mt-20 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-3">
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
            className="object-cover rounded-xl shadow-md"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-gray-800">
        <p>{blog.excerpt}</p>
      </div>
    </div>
  );
}
