import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { RegEvent } from "@/lib/models/regevent";

// Entries dated before this are permanently removed by the bulk "Delete All" action.
const CUTOFF = new Date("2026-01-01T00:00:00.000Z");

export async function POST() {
  try {
    await connectDB();

    const result = await RegEvent.deleteMany({ date: { $lt: CUTOFF } });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} registration event(s) before 2026`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting RegEvents:", error);
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
        { success: false, message: "RegEvent ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete RegEvent
    const deletedEvent = await RegEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "RegEvent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "RegEvent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting RegEvent:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
