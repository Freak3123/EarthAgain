import type { HeroData } from "@/lib/blocks/types";
import { TextField, TextAreaField, StringListField } from "../fields";

export default function HeroEditor({
  data,
  onChange,
}: {
  data: HeroData;
  onChange: (data: HeroData) => void;
}) {
  const set = (patch: Partial<HeroData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextAreaField
        label="Headline"
        value={data.headline}
        onChange={(v) => set({ headline: v })}
        rows={2}
      />
      <TextAreaField
        label="Subtext"
        value={data.subtext}
        onChange={(v) => set({ subtext: v })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Primary button label"
          value={data.primaryLabel}
          onChange={(v) => set({ primaryLabel: v })}
        />
        <TextField
          label="Primary button link"
          value={data.primaryHref}
          onChange={(v) => set({ primaryHref: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Secondary button label"
          value={data.secondaryLabel}
          onChange={(v) => set({ secondaryLabel: v })}
        />
        <TextField
          label="Secondary button link"
          value={data.secondaryHref}
          onChange={(v) => set({ secondaryHref: v })}
        />
      </div>
      <StringListField
        label="Detail chips"
        values={data.details}
        onChange={(v) => set({ details: v })}
        itemPlaceholder="e.g. 500+ attendees"
      />
    </div>
  );
}
