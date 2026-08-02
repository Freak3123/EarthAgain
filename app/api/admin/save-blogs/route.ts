import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/auth/session";
import { resolveContentScope } from "@/lib/auth/contentScope";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service_role only server-side
);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const readTime = formData.get("readTime") as string;
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";
    const file = formData.get("image") as File | null;

    let siteIdsRaw: unknown = [];
    try {
      siteIdsRaw = JSON.parse((formData.get("siteIds") as string) || "[]");
    } catch {
      siteIdsRaw = [];
    }
    const scope = await resolveContentScope(user, {
      siteIds: siteIdsRaw,
      showOnMainSite: formData.get("showOnMainSite"),
    });

    let imageUrl = "";

    if (file) {
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${title}.${ext}`;
      const filePath = `blogs/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("blogs") // 👈 bucket name in Supabase
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }

      const { data } = supabase.storage.from("blogs").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const blog = new Blog({
      title,
      excerpt,
      author,
      date: new Date(date),
      readTime,
      category,
      image: imageUrl,
      featured,
      createdByAdminUserId: user.id,
      siteIds: scope.siteIds,
      showOnMainSite: scope.showOnMainSite,
    });

    await blog.save();

    return NextResponse.json({ message: "Blog created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
