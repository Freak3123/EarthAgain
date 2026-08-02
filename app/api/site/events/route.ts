import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { resolveSiteId, siteAccessError } from "@/lib/auth/siteAccess";
import { Event } from "@/lib/models/events";

/**
 * Site-scoped event list for the sub-site builder's Events tab — same Event
 * collection the main site uses, filtered to this site's own events.
 */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const siteId = resolveSiteId(user, searchParams.get("siteId"));
  if (!siteId) {
    const { error, status } = siteAccessError(user);
    return NextResponse.json({ error }, { status });
  }

  await connectDB();
  const events = await Event.find({ siteIds: siteId }).sort({ date: -1 });
  return NextResponse.json(events);
}
