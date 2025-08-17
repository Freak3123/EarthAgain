import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const readTime = formData.get("readTime") as string;
    const category = formData.get("category") as string;
     const featured = formData.get("featured") === "true";
    const file = formData.get("image") as File | null;
    

    let imagePath = "";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${file.name}`;
      const dirPath = path.join(process.cwd(), "public", "blog-images");
      const filePath = path.join(dirPath, filename);

      // ✅ Ensure folder exists
      await mkdir(dirPath, { recursive: true });

      await writeFile(filePath, buffer);

      imagePath = `/blog-images/${filename}`;
    }

    const blog = new Blog({
      title,
      excerpt,
      author,
      date: new Date(date),
      readTime,
      category,
      image: imagePath,
      featured,

    });

    await blog.save();

    return NextResponse.json({ message: "Blog created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
