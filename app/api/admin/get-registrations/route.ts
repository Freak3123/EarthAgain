import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Registration from "@/lib/models/registrations";

// Make sure to connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI as string);
  }
}

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
