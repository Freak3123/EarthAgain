import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Event } from "@/lib/models/events";


export async function GET(req:Request) {
    await connectDB();
    const events = await Event.find({});
    return NextResponse.json(events);
}