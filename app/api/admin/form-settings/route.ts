import { NextResponse } from "next/server";
import { FormSettings } from "@/lib/models/formSettings";
import { getFormSettings } from "@/lib/formSettings";

const BOOLEAN_FIELDS = [
  "masterLive",
  "registration",
  "volunteer",
  "partner",
  "chapter",
  "panchayat",
  "regEventsHidden",
] as const;

const REGISTRATION_MODES = ["dates", "dates-events"] as const;

/** True when { field, value } is a valid change for the settings singleton. */
function isValidChange(field: string, value: unknown): boolean {
  if ((BOOLEAN_FIELDS as readonly string[]).includes(field)) {
    return typeof value === "boolean";
  }
  if (field === "registrationMode") {
    return (REGISTRATION_MODES as readonly unknown[]).includes(value);
  }
  if (field === "venue") {
    return typeof value === "string";
  }
  return false;
}

export async function PATCH(req: Request) {
  try {
    const { field, value } = await req.json();

    if (!isValidChange(field, value)) {
      return NextResponse.json(
        {
          error:
            "Expected { field: one of masterLive/registration/volunteer/partner/chapter/panchayat (boolean), registrationMode ('dates' | 'dates-events'), venue (string) }",
        },
        { status: 400 }
      );
    }

    await getFormSettings(); // ensures the singleton exists
    const updated = await FormSettings.findOneAndUpdate(
      {},
      { [field]: value },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      masterLive: updated.masterLive,
      registration: updated.registration,
      volunteer: updated.volunteer,
      partner: updated.partner,
      chapter: updated.chapter,
      panchayat: updated.panchayat,
      registrationMode: updated.registrationMode,
      venue: updated.venue,
      regEventsHidden: updated.regEventsHidden,
    });
  } catch (error) {
    console.error("Error updating form settings:", error);
    return NextResponse.json(
      { error: "Failed to update form settings" },
      { status: 500 }
    );
  }
}
