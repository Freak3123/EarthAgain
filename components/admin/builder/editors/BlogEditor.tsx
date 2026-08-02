import type { BlogData } from "@/lib/blocks/types";
import { TextField } from "../fields";

/**
 * Heading-only — the actual posts come live from the shared Blog collection
 * (same system as the main site, filtered by site), managed from the
 * builder's own "Blog" tab, not authored here. See lib/blocks/registry.tsx.
 */
export default function BlogEditor({
  data,
  onChange,
}: {
  data: BlogData;
  onChange: (data: BlogData) => void;
}) {
  const set = (patch: Partial<BlogData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextField
        label={'"View All" button label'}
        value={data.viewAllLabel}
        onChange={(v) => set({ viewAllLabel: v })}
      />
      <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50/60 px-3.5 py-2.5 text-xs text-stone-500">
        Manage the actual blog posts from the <strong>Blog</strong> tab.
      </p>
    </div>
  );
}
