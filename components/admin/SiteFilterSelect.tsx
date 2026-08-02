"use client";
import { useEffect, useState } from "react";

interface SiteOption {
  _id: string;
  slug: string;
  brandName: string;
}

/** "all" | "main" | a real Site._id string. */
export type SiteFilterValue = "all" | "main" | string;

/** Scope filter for the superadmin's Blog/Events lists — All / Main Site / one sub-site. */
export default function SiteFilterSelect({
  value,
  onChange,
}: {
  value: SiteFilterValue;
  onChange: (v: SiteFilterValue) => void;
}) {
  const [sites, setSites] = useState<SiteOption[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/sites");
        const data = await res.json();
        if (res.ok) setSites(data);
      } catch {
        // Filter just won't offer sub-site options.
      }
    })();
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
    >
      <option value="all">All</option>
      <option value="main">Main Site</option>
      {sites.map((s) => (
        <option key={s._id} value={s._id}>
          {s.brandName}
        </option>
      ))}
    </select>
  );
}

/** Does this record belong to the current site-filter scope? */
export function matchesSiteFilter(
  record: { showOnMainSite?: boolean; siteIds?: unknown[] },
  filter: SiteFilterValue
): boolean {
  if (filter === "all") return true;
  if (filter === "main") return record.showOnMainSite === true;
  return Array.isArray(record.siteIds) && record.siteIds.map(String).includes(filter);
}
