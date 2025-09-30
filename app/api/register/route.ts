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
            _id: {
              $in: registration.selectedEvents.map(
                (id: string) => new mongoose.Types.ObjectId(id)
              ),
            },
          }).select("title date speakers time")
        : [];


    function formatTo12Hour(time24: string) {
      if (!time24) return "";
      const [hours, minutes] = time24.split(":").map(Number);
      const suffix = hours >= 12 ? "PM" : "AM";
      const hours12 = ((hours + 11) % 12) + 1; // convert 0–23 → 1–12
      return `${hours12.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${suffix}`;
    }

    await sendConfirmationMail(
      registration.email,
      registration.name,
      registration.registrationDays,
      sessions.map((ev) => ({
        title: ev.title,
        date:
          ev.date instanceof Date
            ? ev.date.toISOString()
            : new Date(ev.date).toISOString(),
        time:  formatTo12Hour(ev.time),
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
