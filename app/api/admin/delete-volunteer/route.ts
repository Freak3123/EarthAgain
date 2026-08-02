import { NextResponse } from "next/server";
import { Volunteer } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";

// Entries created before this are permanently removed by the bulk "Delete All" action.
const CUTOFF = new Date("2026-01-01T00:00:00.000Z");

export async function POST() {
  try {
    await connectDB();

    const result = await Volunteer.deleteMany({ createdAt: { $lt: CUTOFF } });

    return NextResponse.json(
      {
        message: `Deleted ${result.deletedCount} volunteer(s) before 2026`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error bulk deleting volunteers:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete volunteers" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Volunteer ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Volunteer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Volunteer deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting volunteer:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete volunteer" },
      { status: 500 }
    );
  }
}
