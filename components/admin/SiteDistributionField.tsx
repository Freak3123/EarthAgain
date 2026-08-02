"use client";
import { useEffect, useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { label as labelCls, checkbox as checkboxCls } from "./shared";

interface SiteOption {
  _id: string;
  slug: string;
  brandName: string;
}

export interface Distribution {
  showOnMainSite: boolean;
  siteIds: string[];
}

/**
 * "Which site(s) should this show on?" selector for the superadmin's Blog
 * and Event forms — "Main Site" is just one more checkbox alongside every
 * active sub-site, all in the same multi-select list (not a separate toggle).
 * Not shown to subadmins — their own posts/events are auto-scoped server-side.
 */
export default function SiteDistributionField({
  value,
  onChange,
}: {
  value: Distribution;
  onChange: (v: Distribution) => void;
}) {
  const [sites, setSites] = useState<SiteOption[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/sites");
        const data = await res.json();
        setSites(res.ok ? data : []);
      } catch {
        setSites([]);
      }
    })();
  }, []);

  const toggleMain = () => onChange({ ...value, showOnMainSite: !value.showOnMainSite });

  const toggleSite = (id: string) => {
    const has = value.siteIds.includes(id);
    onChange({
      ...value,
      siteIds: has ? value.siteIds.filter((s) => s !== id) : [...value.siteIds, id],
    });
  };

  const selectAllSites = () =>
    onChange({ ...value, siteIds: (sites ?? []).map((s) => s._id) });
  const selectNoSites = () => onChange({ ...value, siteIds: [] });

  return (
    <div>
      <label className={labelCls}>Show on</label>
      <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-3.5">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={value.showOnMainSite}
            onChange={toggleMain}
            className={checkboxCls}
          />
          <Globe className="h-3.5 w-3.5 text-stone-500" />
          <span className="text-sm font-medium text-stone-700">
            Main Site (earthagain.org)
          </span>
        </label>

        <div className="mt-3 border-t border-stone-200 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Sub-sites
            </span>
            {sites && sites.length > 0 && (
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAllSites}
                  className="cursor-pointer font-medium text-green-700 hover:underline"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={selectNoSites}
                  className="cursor-pointer font-medium text-stone-500 hover:underline"
                >
                  None
                </button>
              </div>
            )}
          </div>

          {sites === null ? (
            <div className="flex items-center gap-2 py-2 text-xs text-stone-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading sub-sites…
            </div>
          ) : sites.length === 0 ? (
            <p className="py-1 text-xs text-stone-400">No active sub-sites yet.</p>
          ) : (
            <div className="max-h-40 space-y-1.5 overflow-y-auto">
              {sites.map((s) => (
                <label
                  key={s._id}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <input
                    type="checkbox"
                    checked={value.siteIds.includes(s._id)}
                    onChange={() => toggleSite(s._id)}
                    className={checkboxCls}
                  />
                  <span className="text-sm text-stone-700">{s.brandName}</span>
                  <span className="font-mono text-xs text-stone-400">/s/{s.slug}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
