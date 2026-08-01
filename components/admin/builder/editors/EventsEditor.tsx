import type { EventsData, EventItem } from "@/lib/blocks/types";
import { TextField, TextAreaField, ImageField, RepeaterField } from "../fields";

const blankItem = (): EventItem => ({
  place: "",
  title: "",
  description: "",
  time: "",
  date: "",
  imageUrl: "",
});

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
      <RepeaterField<EventItem>
        label="Events"
        items={data.items}
        onChange={(v) => set({ items: v })}
        newItem={blankItem}
        itemLabel={(it) => it.title || "New event"}
        addLabel="Add event"
        renderItem={(it, update) => (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Location" value={it.place} onChange={(v) => update({ place: v })} />
              <TextField label="Title" value={it.title} onChange={(v) => update({ title: v })} />
            </div>
            <TextAreaField
              label="Description"
              value={it.description}
              onChange={(v) => update({ description: v })}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Time" value={it.time} onChange={(v) => update({ time: v })} />
              <TextField label="Date" value={it.date} onChange={(v) => update({ date: v })} />
            </div>
            <ImageField label="Image" value={it.imageUrl} onChange={(v) => update({ imageUrl: v })} />
          </>
        )}
      />
    </div>
  );
}
