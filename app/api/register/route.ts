import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Registration from "@/lib/models/registrations";
import { RegEvent } from "@/lib/models/regevent";
import { sendConfirmationMail } from "@/lib/nodemailer";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const registration = await Registration.create(body);

    // const sessions =
    //   registration.selectedEvents && registration.selectedEvents.length > 0
    //     ? await RegEvent.find({
    //         _id: { $in: registration.selectedEvents },
    //       }).select("title date speakers")
    //     : [];

    const sessions =
  registration.selectedEvents && registration.selectedEvents.length > 0
    ? await RegEvent.find({
        _id: { $in: registration.selectedEvents.map((id: string) => new mongoose.Types.ObjectId(id)) },
      }).select("title date speakers time")
    : [];

    console.log("Sessions fetched for email:", sessions);

    await sendConfirmationMail(
      registration.email,
      registration.name,
      registration.registrationDays,
      sessions.map((ev) => ({
        title: ev.title,
        date: ev.date instanceof Date ? ev.date.toISOString() : new Date(ev.date).toISOString(),
        time: ev.time,
        speakers: ev.speakers,
      }))
    );

    return NextResponse.json(
      { success: true, data: registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 500 }
    );
  }
}
