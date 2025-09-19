import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Speakers } from "@/lib/models/speakers";
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
        { success: false, message: "Speaker ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete speaker
    const deletedSpeaker = await Speakers.findByIdAndDelete(id);

    if (!deletedSpeaker) {
      return NextResponse.json(
        { success: false, message: "Speaker not found" },
        { status: 404 }
      );
    }

    // If speaker had an image, delete it from Supabase
    if (deletedSpeaker.image) {
      const imageUrl = deletedSpeaker.image as string;

      // Extract relative path from public URL
      const filePath = imageUrl.split("/storage/v1/object/public/speakers/")[1];
      // Change "speakers" if your bucket name is different

      if (filePath) {
        await supabase.storage.from("speakers").remove([filePath]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Speaker and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
