import type { NewsletterData } from "@/lib/blocks/types";
import { TextField, TextAreaField } from "../fields";

export default function NewsletterEditor({
  data,
  onChange,
}: {
  data: NewsletterData;
  onChange: (data: NewsletterData) => void;
}) {
  const set = (patch: Partial<NewsletterData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextAreaField label="Body" value={data.body} onChange={(v) => set({ body: v })} />
    </div>
  );
}
