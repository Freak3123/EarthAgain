import type { ISiteSettings } from "@/lib/models/site";
import { TextField, ImageField, RepeaterField } from "./fields";

type NavLink = { label: string; href: string };
type Social = { platform: string; url: string };

export default function SettingsPanel({
  settings,
  onChange,
}: {
  settings: ISiteSettings;
  onChange: (settings: ISiteSettings) => void;
}) {
  const set = (patch: Partial<ISiteSettings>) => onChange({ ...settings, ...patch });
  const footerDescription =
    typeof settings.footer?.description === "string" ? settings.footer.description : "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Brand name"
          value={settings.brandName}
          onChange={(v) => set({ brandName: v })}
        />
        <TextField label="Tagline" value={settings.tagline} onChange={(v) => set({ tagline: v })} />
      </div>

      <ImageField label="Logo" value={settings.logoUrl} onChange={(v) => set({ logoUrl: v })} />

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
          Accent color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settings.accent || "#16a34a"}
            onChange={(e) => set({ accent: e.target.value })}
            className="h-10 w-14 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
          />
          <TextField
            label=""
            value={settings.accent}
            onChange={(v) => set({ accent: v })}
            placeholder="#16a34a"
          />
        </div>
      </div>

      <RepeaterField<NavLink>
        label="Navigation links"
        items={settings.nav}
        onChange={(v) => set({ nav: v })}
        newItem={() => ({ label: "", href: "#" })}
        itemLabel={(l) => l.label || "New link"}
        addLabel="Add link"
        renderItem={(l, update) => (
          <div className="grid grid-cols-2 gap-2.5">
            <TextField label="Label" value={l.label} onChange={(v) => update({ label: v })} />
            <TextField label="Link" value={l.href} onChange={(v) => update({ href: v })} />
          </div>
        )}
      />

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
          Footer description
        </label>
        <textarea
          value={footerDescription}
          onChange={(e) =>
            set({ footer: { ...settings.footer, description: e.target.value } })
          }
          rows={3}
          className="w-full resize-y rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 transition focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
        />
      </div>

      <RepeaterField<Social>
        label="Social links"
        items={settings.socials}
        onChange={(v) => set({ socials: v })}
        newItem={() => ({ platform: "", url: "" })}
        itemLabel={(s) => s.platform || "New social"}
        addLabel="Add social link"
        renderItem={(s, update) => (
          <div className="grid grid-cols-2 gap-2.5">
            <TextField
              label="Platform"
              value={s.platform}
              onChange={(v) => update({ platform: v })}
              placeholder="Instagram, Twitter…"
            />
            <TextField label="URL" value={s.url} onChange={(v) => update({ url: v })} />
          </div>
        )}
      />
    </div>
  );
}
