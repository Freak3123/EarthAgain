import { NextResponse } from "next/server";
import { Host } from "@/lib/models/host";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function GET() {
  try {
    await connectDB();
    const hosts = await Host.find().sort({ createdAt: -1 }).exec();
    return NextResponse.json(hosts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching hosts:", error);
    return NextResponse.json(
      { error: "Failed to fetch hosts" },
      { status: 500 }
    );
  }
}
