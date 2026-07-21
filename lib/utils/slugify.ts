/** Normalize an arbitrary string into a URL-safe slug. Pure, client-safe. */
export function slugify(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric -> dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .slice(0, 60);
}
