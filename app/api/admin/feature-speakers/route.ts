import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { Speakers } from "@/lib/models/speakers";

/**
 * Toggle a speaker's `isFeatured` flag — drives the admin list-row badge and
 * the Featured Speakers grid on /speakers, which filters on it.
 *
 * Note the field is `isFeatured` here, not `featured` as on events and blogs.
 * The model carries no siteIds, so any signed-in admin may toggle.
 */
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, isFeatured } = await req.json();
  if (!id || typeof isFeatured !== "boolean") {
    return NextResponse.json({ error: "id and isFeatured are required" }, { status: 400 });
  }

  await connectDB();
  const speaker = await Speakers.findById(id);
  if (!speaker) {
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  }

  speaker.isFeatured = isFeatured;
  await speaker.save();

  return NextResponse.json({ success: true, isFeatured: speaker.isFeatured });
}
