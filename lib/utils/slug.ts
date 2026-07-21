import { Site } from "@/lib/models/site";
import { slugify } from "@/lib/utils/slugify";

export { slugify };

/** True if no active/suspended Site already owns this slug. */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const existing = await Site.findOne({ slug }).select("_id").lean().exec();
  return !existing;
}

/**
 * Turn a base string into a unique slug, appending -2, -3, ... on collision.
 * Assumes connectDB() has already run.
 */
export async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "site";
  let candidate = root;
  let n = 2;
  // Bounded loop — practically never iterates more than a handful of times.
  while (!(await isSlugAvailable(candidate))) {
    candidate = `${root}-${n}`;
    n++;
  }
  return candidate;
}
