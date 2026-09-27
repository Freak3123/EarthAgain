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

    // The subscriber is already saved, so a mail failure must not fail the
    // request — reporting an error here would invite a duplicate submission.
    let mailSent = true;
    try {
      await sendStayUpdatedMail(email);
    } catch (mailError) {
      mailSent = false;
      console.error(
        "Subscriber saved but updates email failed:",
        subscriber._id,
        mailError
      );
    }

    return NextResponse.json({ success: true, subscriber, mailSent });
  } catch (error) {
    console.error("StayUpdated error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
