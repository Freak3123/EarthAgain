import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { Chapter } from "@/lib/models/chapter";

export async function POST(req: Request) {
  const actor = await getSessionUser();
  if (!isSuperadmin(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const { chapterId } = await req.json();

  if (!chapterId) {
    return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  if (chapter.status === "approved") {
    return NextResponse.json(
      { error: "This chapter is already approved and cannot be rejected" },
      { status: 409 }
    );
  }

  chapter.status = "rejected";
  await chapter.save();

  return NextResponse.json({ success: true });
}
