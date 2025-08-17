import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";


export async function GET(req:Request) {
    await connectDB();
    const events = await Blog.find({});
    return NextResponse.json(events);
}