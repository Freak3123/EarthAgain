import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { RegDate } from "@/lib/models/regdate";

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await connectDB();
    const deleted = await RegDate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration date:", error);
    return NextResponse.json(
      { error: "Failed to delete registration date" },
      { status: 500 }
    );
  }
}
