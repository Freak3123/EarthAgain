import { NextResponse } from "next/server";
import { Partner } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Partner.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting partner:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}
