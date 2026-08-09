import { NextResponse } from "next/server";
import "@/lib/models/regevent";
import Registration from "@/lib/models/registrations";
import { connectDB } from "@/config/mongoDB/connectDB";
import { eventsOnDays } from "@/lib/registrationDays";

export async function GET() {
  try {
    await connectDB();

    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .populate("selectedEvents", "title date time")
      .lean();

    // Whole-day registrations deliberately store no sessions. Resolve them from
    // the day now — that is what lets sessions added *after* someone registered
    // still show up against them here and in the CSV export.
    const dayGroups = new Map<string, string[]>();
    for (const reg of registrations) {
      if (reg.registrationMode !== "dates") continue;
      const days = reg.registrationDays ?? [];
      dayGroups.set(days.join("|"), days);
    }

    const resolvedByDays = new Map<string, unknown[]>();
    for (const [key, days] of dayGroups) {
      const events = await eventsOnDays(days);
      resolvedByDays.set(
        key,
        events.map((ev) => ({
          _id: ev._id,
          title: ev.title,
          date: ev.date,
          time: ev.time,
        }))
      );
    }

    const withSessions = registrations.map((reg) =>
      reg.registrationMode === "dates"
        ? {
            ...reg,
            selectedEvents:
              resolvedByDays.get((reg.registrationDays ?? []).join("|")) ?? [],
          }
        : reg
    );

    return NextResponse.json(withSessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
