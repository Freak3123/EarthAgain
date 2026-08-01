import type { FeaturedData, FeaturedItem } from "@/lib/blocks/types";
import { TextField, TextAreaField, ImageField, RepeaterField } from "../fields";

const blankItem = (): FeaturedItem => ({
  badge: "",
  title: "",
  excerpt: "",
  author: "",
  meta: "",
  imageUrl: "",
});

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
      <RepeaterField<FeaturedItem>
        label="Items"
        items={data.items}
        onChange={(v) => set({ items: v })}
        newItem={blankItem}
        itemLabel={(it) => it.title || "New item"}
        addLabel="Add item"
        renderItem={(it, update) => (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Badge" value={it.badge} onChange={(v) => update({ badge: v })} />
              <TextField label="Title" value={it.title} onChange={(v) => update({ title: v })} />
            </div>
            <TextAreaField
              label="Excerpt"
              value={it.excerpt}
              onChange={(v) => update({ excerpt: v })}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Author" value={it.author} onChange={(v) => update({ author: v })} />
              <TextField label="Meta" value={it.meta} onChange={(v) => update({ meta: v })} />
            </div>
            <ImageField label="Image" value={it.imageUrl} onChange={(v) => update({ imageUrl: v })} />
          </>
        )}
      />
    </div>
  );
}
