import { NextResponse } from "next/server";
import { getFormSettings } from "@/lib/formSettings";

// Public read: consumed both by the admin dashboard and by the public-facing
// form pages (register, join-us, start-chapter) to know whether they should
// render their form or a "paused" notice. The register page also reads
// registrationMode from here to decide whether to show the session picker.
export async function GET() {
  try {
    const settings = await getFormSettings();

    return NextResponse.json({
      masterLive: settings.masterLive,
      registration: settings.registration,
      volunteer: settings.volunteer,
      partner: settings.partner,
      chapter: settings.chapter,
      panchayat: settings.panchayat,
      registrationMode: settings.registrationMode,
      venue: settings.venue,
      regEventsHidden: settings.regEventsHidden,
    });
  } catch (error) {
    console.error("Error fetching form settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch form settings" },
      { status: 500 }
    );
  }
}
