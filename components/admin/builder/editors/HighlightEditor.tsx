import type { HighlightData } from "@/lib/blocks/types";
import { TextField, TextAreaField, ImageField } from "../fields";

export default function HighlightEditor({
  data,
  onChange,
}: {
  data: HighlightData;
  onChange: (data: HighlightData) => void;
}) {
  const set = (patch: Partial<HighlightData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextAreaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Author" value={data.author} onChange={(v) => set({ author: v })} />
        <TextField
          label="Read time"
          value={data.readTime}
          onChange={(v) => set({ readTime: v })}
        />
      </div>
      <TextField label="Badge" value={data.badge} onChange={(v) => set({ badge: v })} />
      <ImageField label="Image" value={data.imageUrl} onChange={(v) => set({ imageUrl: v })} />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Link label"
          value={data.linkLabel}
          onChange={(v) => set({ linkLabel: v })}
        />
        <TextField
          label="Link target"
          value={data.linkHref}
          onChange={(v) => set({ linkHref: v })}
        />
      </div>
    </div>
  );
}
