/**
 * The home-page teaser rule, shared by the events and blog sections.
 *
 * Featured entries claim the slots first, newest first; whatever slots they
 * leave over go to the most recent of the rest, so the row stays full even
 * when the admins have flagged fewer than `count` entries as featured. The row
 * that comes back is ordered by date, newest first, regardless of which
 * entries were featured and which were topped up.
 */
export function pickFeaturedFirst<T extends { featured?: boolean; date: string }>(
  items: T[],
  count: number
): T[] {
  // An unparseable date falls back to 0 so it sorts last, rather than making
  // the whole comparison NaN.
  const byDateDesc = (a: T, b: T) =>
    (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0);

  const featured = items.filter((item) => item.featured).sort(byDateDesc);
  const rest = items.filter((item) => !item.featured).sort(byDateDesc);

  return [
    ...featured.slice(0, count),
    ...rest.slice(0, Math.max(0, count - featured.length)),
  ].sort(byDateDesc);
}
