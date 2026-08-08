import { NextResponse } from "next/server";
import { getCountdownTarget } from "@/lib/homeSettings";

// Public read: the admin console loads this to populate the date picker, and
// it is available to any client that needs the countdown target directly.
export async function GET() {
  const countdownTarget = await getCountdownTarget();
  return NextResponse.json({ countdownTarget });
}
