import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { ClimatePanchayatEvent } from "@/lib/models/climate-panchayat";
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
        { success: false, message: "Climate Panchayat ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete the Climate Panchayat
    const deletedPanchayat = await ClimatePanchayatEvent.findByIdAndDelete(id);

    if (!deletedPanchayat) {
      return NextResponse.json(
        { success: false, message: "Climate Panchayat not found" },
        { status: 404 }
      );
    }

    // If event had an image, delete it from Supabase
    if (deletedPanchayat.image) {
      const imageUrl = deletedPanchayat.image as string;
      // public URL looks like:
      // https://<project>.supabase.co/storage/v1/object/public/climate-panchayat/<filename>
      const filePath = imageUrl.split(
        "/storage/v1/object/public/climate-panchayat/"
      )[1]; // 👈 adjust if bucket name differs

      if (filePath) {
        await supabase.storage.from("climate-panchayat").remove([filePath]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Climate Panchayat and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Climate Panchayat:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
