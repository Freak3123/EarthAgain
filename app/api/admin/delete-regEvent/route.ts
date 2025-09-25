import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { RegEvent } from "@/lib/models/regevent";

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
