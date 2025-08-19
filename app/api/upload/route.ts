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
    const fileExt = file.name.split(".").pop();
    const fileName = `${title}-${Date.now()}.${fileExt}`;
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




// import { NextRequest, NextResponse } from "next/server";
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const title = formData.get("title") as string; // 👈 event title from form

//     if (!file || !title) {
//       return NextResponse.json({ error: "Missing file or title" }, { status: 400 });
//     }

//     // Convert File -> Buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Ensure uploads directory exists
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await mkdir(uploadDir, { recursive: true });

//     // Extract extension from original file
//     const ext = path.extname(file.name);

//     // Slugify title for safe filename
//     const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-");

//     // Final filename = event title + extension
//     const fileName = `${safeTitle}${ext}`;
//     const filePath = path.join(uploadDir, fileName);

//     await writeFile(filePath, buffer);

//     return NextResponse.json({
//       filePath: `/uploads/${fileName}`, // Public path
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
