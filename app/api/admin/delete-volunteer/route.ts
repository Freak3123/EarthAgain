import { NextResponse } from "next/server";
import { Volunteer } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";

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
