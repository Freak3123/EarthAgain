import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongoDB/connectDB";
import Blog from "@/lib/models/blogs";
import { getSessionUser, isSuperadmin } from "@/lib/auth/session";

/**
 * Public + superadmin-console endpoint. Superadmins see every blog ever
 * created (their "All" view); everyone else (public visitors, the home page
 * teaser, a subadmin's own browser session) only sees blogs flagged
 * showOnMainSite — sub-site-exclusive posts never leak onto the main site.
 */
export async function GET() {
  await connectDB();
  const user = await getSessionUser();
  const filter = isSuperadmin(user) ? {} : { showOnMainSite: true };
  const blogs = await Blog.find(filter);
  return NextResponse.json(blogs);
}
