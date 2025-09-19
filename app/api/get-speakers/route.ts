import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Speakers } from '@/lib/models/speakers';

export async function GET(req:Request) {
    await connectDB();
    const speakers = await Speakers.find({});
    return NextResponse.json(speakers);
}