import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { Event } from "@/lib/models/events";

/**
 * Toggle an event's `featured` flag — drives both the main site's "Featured"
 * list-row badge and a sub-site's Featured section (see
 * lib/blocks/liveContent.ts's buildFeaturedItems). Same ownership rule as
 * delete-events: superadmin unconditional, subadmin only for their own site.
 */
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, featured } = await req.json();
  if (!id || typeof featured !== "boolean") {
    return NextResponse.json({ error: "id and featured are required" }, { status: 400 });
  }

  await connectDB();
  const event = await Event.findById(id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  if (!isSuperadmin(user)) {
    const owns = event.siteIds?.some((s: any) => String(s) === user.siteId);
    if (!owns) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  event.featured = featured;
  await event.save();

  return NextResponse.json({ success: true, featured: event.featured });
}
