import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Registration from "@/lib/models/registrations";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function GET() {
  try {
    await connectDB();

    const registrations = await Registration.find().sort({ createdAt: -1 });

    return NextResponse.json(registrations, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
