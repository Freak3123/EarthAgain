import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { RegDate } from "@/lib/models/regdate";

// Public read: the register form merges these with the days derived from
// reg events to build its list of selectable days.
export async function GET() {
  try {
    await connectDB();
    const dates = await RegDate.find({}).sort({ date: 1 });
    return NextResponse.json(dates, { status: 200 });
  } catch (error) {
    console.error("Error fetching registration dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch registration dates" },
      { status: 500 }
    );
  }
}
