import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";
import Blog from "@/lib/models/blogs";

/**
 * Toggle a blog post's `featured` flag — drives both the main site's
 * "Featured" list-row badge and a sub-site's Featured section (see
 * lib/blocks/liveContent.ts's buildFeaturedItems). Same ownership rule as
 * delete-blogs: superadmin unconditional, subadmin only for their own site.
 */
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, featured } = await req.json();
  if (!id || typeof featured !== "boolean") {
    return NextResponse.json({ error: "id and featured are required" }, { status: 400 });
  }

  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

  if (!isSuperadmin(user)) {
    const owns = blog.siteIds?.some((s: any) => String(s) === user.siteId);
    if (!owns) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  blog.featured = featured;
  await blog.save();

  return NextResponse.json({ success: true, featured: blog.featured });
}
