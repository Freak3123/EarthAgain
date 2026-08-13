import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import { resolveContentScope } from "@/lib/auth/contentScope";
import { sanitizeBlogHtml } from "@/lib/sanitizeHtml";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service_role only server-side
);

const BUCKET = "blogs";
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

/** Upload one file and return its public URL, or null if the upload failed. */
async function uploadImage(file: File, title: string) {
  const ext = file.name.split(".").pop();
  // Random suffix: a post with several images uploads them in the same
  // millisecond, and identical paths would collide with upsert disabled.
  const suffix = Math.random().toString(36).slice(2, 8);
  const slug = title.replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 60);
  const filePath = `${BUCKET}/${Date.now()}-${suffix}-${slug}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error(error);
    return null;
  }
  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

/** Remove images from storage by public URL; ignores anything unparseable. */
async function removeImages(urls: (string | undefined)[]) {
  const paths = urls
    .map((u) => u?.split(PUBLIC_PREFIX)[1])
    .filter((p): p is string => Boolean(p));
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
}

/** Files posted under `images` — the optional gallery shown below the body. */
function galleryFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = sanitizeBlogHtml(formData.get("content"));
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

    if (file && file.size > 0) {
      const uploaded = await uploadImage(file, title);
      if (!uploaded)
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      imageUrl = uploaded;
    }

    const gallery: string[] = [];
    for (const extra of galleryFiles(formData)) {
      const uploaded = await uploadImage(extra, title);
      if (uploaded) gallery.push(uploaded);
    }

    const blog = new Blog({
      title,
      excerpt,
      content,
      author,
      date: new Date(date),
      readTime,
      category,
      image: imageUrl,
      images: gallery,
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

/**
 * Edit an existing post. Same ownership rule as delete-blogs and
 * feature-blog: superadmin unconditional, subadmin only for their own site.
 *
 * The primary image is replaced only when a new file is sent. The gallery is
 * declarative — `keepImages` lists the existing URLs to retain, anything
 * missing from it is deleted from storage, and new files are appended.
 */
export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const formData = await req.formData();

    const id = formData.get("id") as string;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    if (!isSuperadmin(user)) {
      const owns = blog.siteIds?.some((s) => String(s) === user.siteId);
      // Same 404-not-403 as the sibling routes — don't confirm it exists.
      if (!owns) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const title = formData.get("title") as string;
    blog.title = title;
    blog.excerpt = formData.get("excerpt") as string;
    blog.content = sanitizeBlogHtml(formData.get("content"));
    blog.author = formData.get("author") as string;
    blog.date = new Date(formData.get("date") as string);
    blog.readTime = formData.get("readTime") as string;
    blog.category = formData.get("category") as string;
    blog.featured = formData.get("featured") === "true";

    // Distribution is superadmin-only; a subadmin's post stays pinned to
    // their own site, so leave the existing scope untouched for them.
    if (isSuperadmin(user)) {
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
      blog.siteIds = scope.siteIds;
      blog.showOnMainSite = scope.showOnMainSite;
    }

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const uploaded = await uploadImage(file, title);
      if (!uploaded)
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      const previous = blog.image;
      blog.image = uploaded;
      await removeImages([previous]);
    }

    let keep: string[] = [];
    try {
      const parsed = JSON.parse((formData.get("keepImages") as string) || "[]");
      if (Array.isArray(parsed))
        keep = parsed.filter((u): u is string => typeof u === "string");
    } catch {
      keep = [];
    }
    const existing = blog.images ?? [];
    const retained = existing.filter((u) => keep.includes(u));
    const dropped = existing.filter((u) => !keep.includes(u));

    const added: string[] = [];
    for (const extra of galleryFiles(formData)) {
      const uploaded = await uploadImage(extra, title);
      if (uploaded) added.push(uploaded);
    }

    blog.images = [...retained, ...added];
    await blog.save();
    if (dropped.length) await removeImages(dropped);

    return NextResponse.json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
