import type { FeaturedData } from "@/lib/blocks/types";
import { TextField } from "../fields";

/**
 * Heading-only — the actual items are whichever blog posts/events are marked
 * "featured" (from the Blog/Events tabs), combined and shown here. Manage
 * what's featured from the builder's own "Featured" tab, not here.
 * See lib/blocks/registry.tsx.
 */
export default function FeaturedEditor({
  data,
  onChange,
}: {
  data: FeaturedData;
  onChange: (data: FeaturedData) => void;
}) {
  const set = (patch: Partial<FeaturedData>) => onChange({ ...data, ...patch });
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
        Mark blog posts or events as <strong>Featured</strong> from the Blog
        or Events tab — manage the combined list from the{" "}
        <strong>Featured</strong> tab.
      </p>
    </div>
  );
}
