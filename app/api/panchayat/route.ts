import { NextResponse } from "next/server";
import ClimatePanchayat, { IClimatePanchayat } from "@/lib/models/panchayat";
import { connectDB } from "@/config/mongoDB/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newEntry: IClimatePanchayat = await ClimatePanchayat.create(body);
    return NextResponse.json(newEntry, { status: 201 });
  } catch (err) {
    console.error("Error creating Climate Panchayat entry:", err);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const entries = await ClimatePanchayat.find().sort({ createdAt: -1 });
    return NextResponse.json(entries, { status: 200 });
  } catch (err) {
    console.error("Error fetching Climate Panchayat entries:", err);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}
