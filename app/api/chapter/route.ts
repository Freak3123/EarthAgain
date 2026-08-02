import { NextResponse } from "next/server";
import { Chapter } from "@/lib/models/chapter";
import { connectDB } from "@/config/mongoDB/connectDB";
import { isFormLive } from "@/lib/formSettings";

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!(await isFormLive("chapter"))) {
      return NextResponse.json(
        { success: false, message: "This form isn't open right now. We'll start this soon." },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Keep only the field that belongs to the selected type
    const payload = {
      ...body,
      entityName: body.type === "local-entity" ? body.entityName || body.name : undefined,
      instituteName: body.type === "college-chapter" ? body.instituteName : undefined,
    };

    const chapter = new Chapter(payload);
    await chapter.save();

    return NextResponse.json({
      success: true,
      message: "Thanks for starting a chapter with us!",
    });
  } catch (error: any) {
    console.error("Chapter save error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
