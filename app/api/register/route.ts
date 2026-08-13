import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Registration from "@/lib/models/registrations";
import { RegEvent } from "@/lib/models/regevent";
import { sendConfirmationMail } from "@/lib/nodemailer";
import { isFormLive, getFormSettings } from "@/lib/formSettings";
import { eventsOnDays, formatTo12Hour } from "@/lib/registrationDays";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!(await isFormLive("registration"))) {
      return NextResponse.json(
        { success: false, error: "Registration isn't open right now. We'll start this soon." },
        { status: 403 }
      );
    }

    const settings = await getFormSettings();
    // Hiding every session removes them from the form and the email alike, so
    // it registers people for whole days regardless of the configured mode.
    const mode = settings.regEventsHidden ? "dates" : settings.registrationMode;

    const body = await req.json();

    // In "dates" mode the day is the whole registration — sessions are resolved
    // from the day whenever they're needed, so nothing is stored per-session.
    const registration = await Registration.create(
      mode === "dates"
        ? { ...body, selectedEvents: [], registrationMode: mode }
        : { ...body, registrationMode: mode }
    );

    const sessions =
      mode === "dates-events" &&
      registration.selectedEvents &&
      registration.selectedEvents.length > 0
        ? await RegEvent.find({
            _id: {
              $in: registration.selectedEvents.map(
                (id: string) => new mongoose.Types.ObjectId(id)
              ),
            },
          }).select("title date speakers time")
        : [];

    // Whole-day registrants get a single "from X onwards" time, taken from the
    // earliest session across the days they picked.
    // Skipped while sessions are hidden — their times are part of what's
    // hidden, so the email simply omits the Time line.
    let startTime: string | undefined;
    if (mode === "dates" && !settings.regEventsHidden) {
      const dayEvents = await eventsOnDays(registration.registrationDays);
      const times = dayEvents
        .map((ev) => ev.time)
        .filter((t): t is string => Boolean(t) && /^\d{1,2}:\d{2}/.test(t))
        .sort();
      if (times.length > 0) startTime = formatTo12Hour(times[0]);
    }

    // The registration is already saved by this point, so a mail failure must
    // not fail the request — the person is registered either way, and telling
    // them otherwise would invite a duplicate submission.
    let mailSent = true;
    try {
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
          time: formatTo12Hour(ev.time),
          speakers: ev.speakers,
        })),
        { mode, venue: settings.venue ?? "", startTime }
      );
    } catch (mailError) {
      mailSent = false;
      console.error(
        "Registration saved but confirmation email failed:",
        registration._id,
        mailError
      );
    }

    return NextResponse.json(
      { success: true, data: registration, mailSent },
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
