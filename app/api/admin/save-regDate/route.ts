import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { RegDate } from "@/lib/models/regdate";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, note } = await req.json();
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "date must be a YYYY-MM-DD string" },
        { status: 400 }
      );
    }

    await connectDB();

    // Midday UTC keeps the calendar day stable in every timezone.
    const parsed = new Date(`${date}T12:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const existing = await RegDate.findOne({ date: parsed });
    if (existing) {
      return NextResponse.json(
        { error: "That date has already been added." },
        { status: 409 }
      );
    }

    const regDate = await RegDate.create({
      date: parsed,
      note: typeof note === "string" ? note.trim() : undefined,
    });

    return NextResponse.json(regDate, { status: 201 });
  } catch (error) {
    console.error("Error saving registration date:", error);
    return NextResponse.json(
      { error: "Failed to save registration date" },
      { status: 500 }
    );
  }
}
