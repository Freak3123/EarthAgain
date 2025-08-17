import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {connectDB} from "@/config/mongoDB/connectDB";  // your MongoDB connection helper
import {Event} from "@/lib/models/events"; // your Mongoose event model

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
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
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
      message: "Event and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
