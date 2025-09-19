import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { Speakers } from "@/lib/models/speakers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const session = formData.get("session") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const file = formData.get("image") as File | null;

    if (!name || !session) {
      return NextResponse.json(
        { error: "Name and session are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${name.replace(/\s+/g, "-")}.${ext}`;
      const filePath = `speakers/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("speakers")
        .upload(filePath, buffer, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }

      const { data } = supabase.storage.from("speakers").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const speaker = new Speakers({
      name,
      session,
      image: imageUrl,
      isFeatured,
    });

    await speaker.save();

    return NextResponse.json(
      { message: "Speaker created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating speaker:", error);
    return NextResponse.json(
      { error: "Failed to create speaker" },
      { status: 500 }
    );
  }
}
