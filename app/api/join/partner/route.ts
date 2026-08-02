import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Partner } from "@/lib/models/join";
import { connectDB } from "@/config/mongoDB/connectDB";
import { isFormLive } from "@/lib/formSettings";

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!(await isFormLive("partner"))) {
      return NextResponse.json(
        { success: false, message: "This form isn't open right now. We'll start this soon." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const partner = new Partner(body);
    await partner.save();

    return NextResponse.json({ success: true, message: "Thanks for partnering with us!" });
  } catch (error: any) {
    console.error("Partner save error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
