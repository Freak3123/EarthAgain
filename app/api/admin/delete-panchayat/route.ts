import { NextResponse } from "next/server";
import ClimatePanchayat from "@/lib/models/panchayat";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Panchayat application ID is required" },
        { status: 400 }
      );
    }

    const deleted = await ClimatePanchayat.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Panchayat application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Panchayat application deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting panchayat application:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete panchayat application" },
      { status: 500 }
    );
  }
}

// Entries whose preferred hosting date is before this are permanently
// removed by the bulk "Delete All" action. Entries with no preferred date
// are never matched, mirroring the admin UI's "New" bucket for them.
const CUTOFF = new Date("2026-01-01T00:00:00.000Z");

export async function POST() {
  try {
    await connectDB();

    const result = await ClimatePanchayat.deleteMany({
      preferredDate: { $lt: CUTOFF },
    });

    return NextResponse.json(
      {
        message: `Deleted ${result.deletedCount} panchayat application(s) before 2026`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error bulk deleting panchayat applications:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete panchayat applications" },
      { status: 500 }
    );
  }
}
