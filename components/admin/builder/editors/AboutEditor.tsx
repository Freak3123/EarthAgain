import type { AboutData, AboutStat } from "@/lib/blocks/types";
import { TextField, StringListField, RepeaterField } from "../fields";

export default function AboutEditor({
  data,
  onChange,
}: {
  data: AboutData;
  onChange: (data: AboutData) => void;
}) {
  const set = (patch: Partial<AboutData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <StringListField
        label="Paragraphs"
        values={data.paragraphs}
        onChange={(v) => set({ paragraphs: v })}
        multiline
        itemPlaceholder="A paragraph about your organization…"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={'"Learn more" label'}
          value={data.learnMoreLabel}
          onChange={(v) => set({ learnMoreLabel: v })}
        />
        <TextField
          label={'"Learn more" link'}
          value={data.learnMoreHref}
          onChange={(v) => set({ learnMoreHref: v })}
        />
      </div>
      <RepeaterField<AboutStat>
        label="Stats"
        items={data.stats}
        onChange={(v) => set({ stats: v })}
        newItem={() => ({ value: "", label: "" })}
        itemLabel={(s) => s.label || "New stat"}
        addLabel="Add stat"
        renderItem={(s, update) => (
          <div className="grid grid-cols-2 gap-2.5">
            <TextField label="Value" value={s.value} onChange={(v) => update({ value: v })} />
            <TextField label="Label" value={s.label} onChange={(v) => update({ label: v })} />
          </div>
        )}
      />
    </div>
  );
}
