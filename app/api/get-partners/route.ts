import { NextResponse } from "next/server";
import { Partner } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find().sort({ createdAt: -1 }).exec();
    return NextResponse.json(partners, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
