import type { BlogData, BlogPost } from "@/lib/blocks/types";
import { TextField, TextAreaField, ImageField, RepeaterField } from "../fields";

const blankPost = (): BlogPost => ({
  badge: "",
  title: "",
  excerpt: "",
  author: "",
  date: "",
  read: "",
  imageUrl: "",
});

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
      <RepeaterField<BlogPost>
        label="Posts"
        items={data.posts}
        onChange={(v) => set({ posts: v })}
        newItem={blankPost}
        itemLabel={(p) => p.title || "New post"}
        addLabel="Add post"
        renderItem={(p, update) => (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Badge" value={p.badge} onChange={(v) => update({ badge: v })} />
              <TextField label="Title" value={p.title} onChange={(v) => update({ title: v })} />
            </div>
            <TextAreaField
              label="Excerpt"
              value={p.excerpt}
              onChange={(v) => update({ excerpt: v })}
              rows={2}
            />
            <div className="grid grid-cols-3 gap-2.5">
              <TextField label="Author" value={p.author} onChange={(v) => update({ author: v })} />
              <TextField label="Date" value={p.date} onChange={(v) => update({ date: v })} />
              <TextField label="Read time" value={p.read} onChange={(v) => update({ read: v })} />
            </div>
            <ImageField label="Image" value={p.imageUrl} onChange={(v) => update({ imageUrl: v })} />
          </>
        )}
      />
    </div>
  );
}
