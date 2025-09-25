import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { RegEvent } from "@/lib/models/regevent";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const speakers = formData.getAll("speakers") as string[]; // allows multiple speakers

    if (!title || !date || !description || speakers.length === 0) {
      return NextResponse.json(
        { error: "Title, date, description, and at least one speaker are required" },
        { status: 400 }
      );
    }

    const regEvent = new RegEvent({
      title,
      date: new Date(date),
      description,
      speakers,
    });

    await regEvent.save();

    return NextResponse.json(
      { message: "Registration event created successfully", regEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating registration event:", error);
    return NextResponse.json(
      { error: "Failed to create registration event" },
      { status: 500 }
    );
  }
}
