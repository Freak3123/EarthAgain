import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Volunteer } from "@/lib/models/join"; 
import { connectDB } from "@/config/mongoDB/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const volunteer = new Volunteer(body);
    await volunteer.save();

    return NextResponse.json({ success: true, message: "Thanks for joining as a volunteer!" });
  } catch (error: any) {
    console.error("Volunteer save error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
