import { NextResponse } from "next/server";
import StayUpdated from "@/lib/models/stayupdated";
import { connectDB } from "@/config/mongoDB/connectDB";
import { sendStayUpdatedMail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Save subscriber
    const subscriber = await StayUpdated.create({ email });

    // Send welcome/updates mail
    await sendStayUpdatedMail(email);

    return NextResponse.json({ success: true, subscriber });
  } catch (error) {
    console.error("StayUpdated error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
