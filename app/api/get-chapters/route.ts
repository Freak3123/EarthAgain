import { NextResponse } from "next/server";
import { Chapter } from "@/lib/models/chapter";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function GET() {
  try {
    await connectDB();
    const chapters = await Chapter.find().sort({ createdAt: -1 }).exec();
    return NextResponse.json(chapters, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
