import { NextResponse } from "next/server";
import { Host } from "@/lib/models/host";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const host = new Host(body);
    await host.save();

    return NextResponse.json({
      success: true,
      message: "Thanks for hosting with us!",
    });
  } catch (error: any) {
    console.error("Host save error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
