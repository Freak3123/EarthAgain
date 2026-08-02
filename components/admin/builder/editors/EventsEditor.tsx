import type { EventsData } from "@/lib/blocks/types";
import { TextField } from "../fields";

/**
 * Heading-only — the actual events come live from the shared Event
 * collection (same system as the main site, filtered by site), managed from
 * the builder's own "Events" tab, not authored here. See lib/blocks/registry.tsx.
 */
export default function EventsEditor({
  data,
  onChange,
}: {
  data: EventsData;
  onChange: (data: EventsData) => void;
}) {
  const set = (patch: Partial<EventsData>) => onChange({ ...data, ...patch });
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
        Manage the actual events from the <strong>Events</strong> tab.
      </p>
    </div>
  );
}
