import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Event } from "@/lib/models/events";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role is needed for delete
);

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

    // If event had an image, delete it from Supabase
    if (deletedEvent.image) {
      const imageUrl = deletedEvent.image as string;

      // Extract relative path from public URL
      const filePath = imageUrl.split("/storage/v1/object/public/events/")[1]; 
      // Change "events" if your bucket has a different name

      if (filePath) {
        await supabase.storage.from("events").remove([filePath]);
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
