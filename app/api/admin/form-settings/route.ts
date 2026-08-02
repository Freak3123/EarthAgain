import { NextResponse } from "next/server";
import { FormSettings } from "@/lib/models/formSettings";
import { getFormSettings } from "@/lib/formSettings";

const FIELDS = [
  "masterLive",
  "registration",
  "volunteer",
  "partner",
  "chapter",
  "panchayat",
] as const;

export async function PATCH(req: Request) {
  try {
    const { field, value } = await req.json();

    if (!FIELDS.includes(field) || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Expected { field: one of masterLive/registration/volunteer/partner/chapter/panchayat, value: boolean }" },
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
    });
  } catch (error) {
    console.error("Error updating form settings:", error);
    return NextResponse.json(
      { error: "Failed to update form settings" },
      { status: 500 }
    );
  }
}
