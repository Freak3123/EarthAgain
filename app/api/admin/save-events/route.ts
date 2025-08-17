import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Event } from "@/lib/models/events";


export async function POST(req:Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log(body);

    const newEvent = await Event.create(body);

    return NextResponse.json(
      { message: "Event saved successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving event:", error);
    return NextResponse.json(
      { message: "Error saving event", error },
      { status: 500 }
    );
  }
}