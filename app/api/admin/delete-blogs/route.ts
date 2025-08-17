import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {connectDB} from "@/config/mongoDB/connectDB";  // your MongoDB connection helper
import Blog from "@/lib/models/blogs"; // your Mongoose event model

// DELETE /api/admin/delete-events
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Expecting { id: string }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete event
    const deletedEvent = await Blog.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }


    if (deletedEvent.image) {
      const imagePath = path.join(process.cwd(), "public", deletedEvent.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
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
