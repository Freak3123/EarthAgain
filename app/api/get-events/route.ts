import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Event } from "@/lib/models/events";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";

/**
 * Public + superadmin-console endpoint. Superadmins see every event ever
 * created (their "All" view); everyone else (public visitors, the home page
 * teaser, a subadmin's own browser session) only sees events flagged
 * showOnMainSite — sub-site-exclusive events never leak onto the main site.
 */
export async function GET() {
  await connectDB();
  const user = await getSessionUser();
  const filter = isSuperadmin(user) ? {} : { showOnMainSite: true };
  const events = await Event.find(filter);
  return NextResponse.json(events);
}
