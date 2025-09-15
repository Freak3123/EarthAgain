import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { ClimatePanchayatEvent } from "@/lib/models/climate-panchayat";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service_role should only be used on server
);

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const organizerName = formData.get("organizerName") as string;
    const attendees = formData.get("attendees") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const file = formData.get("image") as File | null;

    let imageUrl = "";

    if (file) {
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${title}.${ext}`;
      const filePath = `climate-panchayat/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("climate-panchayat") 
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json(
          { error: "Image upload failed" },
          { status: 500 }
        );
      }

      const { data } = supabase.storage
        .from("climate-panchayat")
        .getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const climatePanchayat = new ClimatePanchayatEvent({
      title,
      date: new Date(date),
      time,
      location,
      organizerName,
      attendees,
      description,
      image: imageUrl,
      featured,
    });

    await climatePanchayat.save();

    return NextResponse.json(
      { message: "Climate Panchayat created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create Climate Panchayat" },
      { status: 500 }
    );
  }
}
