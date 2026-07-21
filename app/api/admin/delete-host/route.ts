import { NextResponse } from "next/server";
import { Host } from "@/lib/models/host";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Host ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Host.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Host deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting host:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete host" },
      { status: 500 }
    );
  }
}
