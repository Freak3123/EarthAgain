import { NextResponse } from "next/server";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { HomeSettings } from "@/lib/models/homeSettings";
import { getHomeSettings } from "@/lib/homeSettings";

/**
 * Set the home hero countdown's target instant. Superadmin only — this is
 * site-wide copy on the main site, not per-sub-site content.
 *
 * Expects an ISO string (the console converts the admin's local picker value
 * to an instant), so every visitor counts down to the same moment.
 */
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSuperadmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { countdownTarget } = await req.json();
  const parsed = new Date(countdownTarget);
  if (typeof countdownTarget !== "string" || Number.isNaN(parsed.getTime())) {
    return NextResponse.json(
      { error: "countdownTarget must be an ISO date string" },
      { status: 400 }
    );
  }

  await getHomeSettings(); // ensures the singleton exists (and connects)
  const updated = await HomeSettings.findOneAndUpdate(
    {},
    { countdownTarget: parsed },
    { new: true, upsert: true }
  );

  return NextResponse.json({
    countdownTarget: updated.countdownTarget.toISOString(),
  });
}
