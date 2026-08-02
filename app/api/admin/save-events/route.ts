import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Event } from "@/lib/models/events";
import { getSessionUser } from "@/lib/auth/session";
import { resolveContentScope } from "@/lib/auth/contentScope";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const body = await req.json();
    const scope = await resolveContentScope(user, {
      siteIds: body.siteIds,
      showOnMainSite: body.showOnMainSite,
    });

    const newEvent = await Event.create({
      ...body,
      createdByAdminUserId: user.id,
      siteIds: scope.siteIds,
      showOnMainSite: scope.showOnMainSite,
    });

    return NextResponse.json(
      { message: "Event saved successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving event:", error);
    return NextResponse.json(
      { message: "Error saving event", error },
      { status: 500 }
    );
  }
}
