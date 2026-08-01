import type { TeamData, TeamMember } from "@/lib/blocks/types";
import { TextField, ImageField, RepeaterField } from "../fields";

const blankMember = (): TeamMember => ({ name: "", role: "", imageUrl: "" });

export default function TeamEditor({
  data,
  onChange,
}: {
  data: TeamData;
  onChange: (data: TeamData) => void;
}) {
  const set = (patch: Partial<TeamData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-4">
      <TextField label="Kicker" value={data.kicker} onChange={(v) => set({ kicker: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextField
        label={'"View All" button label'}
        value={data.viewAllLabel}
        onChange={(v) => set({ viewAllLabel: v })}
      />
      <RepeaterField<TeamMember>
        label="Members"
        items={data.members}
        onChange={(v) => set({ members: v })}
        newItem={blankMember}
        itemLabel={(m) => m.name || "New member"}
        addLabel="Add member"
        renderItem={(m, update) => (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <TextField label="Name" value={m.name} onChange={(v) => update({ name: v })} />
              <TextField label="Role" value={m.role} onChange={(v) => update({ role: v })} />
            </div>
            <ImageField
              label="Photo"
              value={m.imageUrl}
              onChange={(v) => update({ imageUrl: v })}
            />
          </>
        )}
      />
    </div>
  );
}
