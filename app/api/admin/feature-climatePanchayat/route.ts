import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser } from "@/lib/auth/session";
import { ClimatePanchayatEvent } from "@/lib/models/climate-panchayat";

/**
 * Toggle a Climate Panchayat's `featured` flag — drives the admin list-row
 * badge and the "Featured" band on /climate-panchayat, which filters on it.
 *
 * Unlike feature-event, this model carries no siteIds, so there is no per-site
 * ownership to enforce; any signed-in admin may toggle.
 */
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, featured } = await req.json();
  if (!id || typeof featured !== "boolean") {
    return NextResponse.json({ error: "id and featured are required" }, { status: 400 });
  }

  await connectDB();
  const panchayat = await ClimatePanchayatEvent.findById(id);
  if (!panchayat) {
    return NextResponse.json({ error: "Climate Panchayat not found" }, { status: 404 });
  }

  panchayat.featured = featured;
  await panchayat.save();

  return NextResponse.json({ success: true, featured: panchayat.featured });
}
