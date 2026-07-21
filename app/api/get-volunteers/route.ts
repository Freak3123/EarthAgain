import { NextResponse } from "next/server";
import { Volunteer } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function GET() {
  try {
    await connectDB();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 }).exec();
    return NextResponse.json(volunteers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}
