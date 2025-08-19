import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Expecting { id: string }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete blog
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // If blog had an image, delete it from Supabase
    if (deletedBlog.image) {
      // deletedBlog.image is a public URL → extract the file path
      const imageUrl = deletedBlog.image as string;
      const filePath = imageUrl.split("/storage/v1/object/public/blogs/")[1]; 
      // Adjust "blogs" if your bucket name differs

      if (filePath) {
        await supabase.storage.from("blogs").remove([filePath]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Blog and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Blog:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
