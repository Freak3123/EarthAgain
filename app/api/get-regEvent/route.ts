import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { RegEvent } from "@/lib/models/regevent";
export async function GET(req: Request) {
  try {
    await connectDB();
    const regevents = await RegEvent.find({});
    return NextResponse.json(regevents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching registration events", error },
      { status: 500 }
    );
  }
}
