// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase/supabaseClient";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Create a unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    // sanitize title: remove spaces, special chars, etc.
    const safeTitle = title
  .normalize("NFD")                  // remove accents
  .replace(/\s+/g, "-")              // spaces → dash
  .replace(/[^a-zA-Z0-9-]/g, "");

    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("events") // bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from("events").getPublicUrl(filePath);

    return NextResponse.json({ filePath: data.publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
