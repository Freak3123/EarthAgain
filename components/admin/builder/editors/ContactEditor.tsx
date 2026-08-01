import type { ContactData, ContactItem } from "@/lib/blocks/types";
import { TextField, TextAreaField, RepeaterField } from "../fields";

const blankItem = (): ContactItem => ({ label: "", value: "" });

export default function ContactEditor({
  data,
  onChange,
}: {
  data: ContactData;
  onChange: (data: ContactData) => void;
}) {
  const set = (patch: Partial<ContactData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextAreaField label="Body" value={data.body} onChange={(v) => set({ body: v })} rows={2} />
      <RepeaterField<ContactItem>
        label="Contact details"
        items={data.items}
        onChange={(v) => set({ items: v })}
        newItem={blankItem}
        itemLabel={(it) => it.label || "New detail"}
        addLabel="Add detail"
        renderItem={(it, update) => (
          <div className="grid grid-cols-2 gap-2.5">
            <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} />
            <TextField label="Value" value={it.value} onChange={(v) => update({ value: v })} />
          </div>
        )}
      />
    </div>
  );
}
