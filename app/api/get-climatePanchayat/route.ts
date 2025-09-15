import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { ClimatePanchayatEvent } from '@/lib/models/climate-panchayat';

export async function GET(req:Request) {
    await connectDB();
    const events = await ClimatePanchayatEvent.find({});
    return NextResponse.json(events);
}