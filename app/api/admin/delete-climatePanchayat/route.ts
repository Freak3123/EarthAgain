import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { ClimatePanchayatEvent } from "@/lib/models/climate-panchayat";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

// Entries dated before this are permanently removed by the bulk "Delete All" action.
const CUTOFF = new Date("2026-01-01T00:00:00.000Z");

export async function POST() {
  try {
    await connectDB();

    const toDelete = await ClimatePanchayatEvent.find({ date: { $lt: CUTOFF } });

    const paths = toDelete
      .map((p) => {
        const url = p.image as string | undefined;
        return url?.split("/storage/v1/object/public/climate-panchayat/")[1];
      })
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      await supabase.storage.from("climate-panchayat").remove(paths);
    }

    const result = await ClimatePanchayatEvent.deleteMany({
      date: { $lt: CUTOFF },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} Climate Panchayat event(s) before 2026`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting Climate Panchayat events:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}

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
