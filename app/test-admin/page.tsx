"use client";

/* ==========================================================================
 * TEMPORARY PROTOTYPE — sub-site admin (sub-admin) builder look & feel.
 *
 * This is a throwaway mock: local state only, no DB, no API, nothing is saved.
 * It exists to preview the Phase 4 builder experience before we build it for
 * real. DELETE this route (app/test-admin/) when Phase 3 work begins.
 * See docs/rbac-subsites-design.md §4.
 * ========================================================================== */

import { useState } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Settings,
  Save,
  Send,
  Monitor,
  Pencil,
  ChevronLeft,
  Type,
  Star,
  Info,
  Sparkles,
  CalendarDays,
  Newspaper,
  Users,
  Mail,
  Phone,
  X as XIcon,
} from "lucide-react";
// Reuse the superadmin dashboard's own toggle/list primitives so the
// sub-admin builder feels identical. (These are client-safe presentational
// exports; this temporary route is still standalone and deletable.)
import {
  SectionToggle,
  SectionMode,
  SectionHeading,
  SearchBar,
  EmptyState,
  matches,
} from "@/components/admin/shared";

/* ----------------------------- mock content ----------------------------- */

type BlockType =
  | "hero"
  | "highlight"
  | "about"
  | "featured"
  | "events"
  | "blog"
  | "team"
  | "newsletter"
  | "contact";

interface Block {
  id: string;
  type: BlockType;
  hidden: boolean;
  data: Record<string, any>;
}

const TYPE_META: Record<BlockType, { label: string; icon: any }> = {
  hero: { label: "Hero", icon: Type },
  highlight: { label: "Highlight", icon: Star },
  about: { label: "About", icon: Info },
  featured: { label: "Featured", icon: Sparkles },
  events: { label: "Events", icon: CalendarDays },
  blog: { label: "Blog", icon: Newspaper },
  team: { label: "Team", icon: Users },
  newsletter: { label: "Newsletter", icon: Mail },
  contact: { label: "Contact", icon: Phone },
};

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.round(Math.random() * 1e9));

// Field schema per block type drives the editor forms.
type Field =
  | { key: string; label: string; kind: "text" | "textarea" }
  | { key: string; label: string; kind: "stringList" }
  | { key: string; label: string; kind: "itemList"; item: [string, string][] };

const FIELDS: Record<BlockType, Field[]> = {
  hero: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "headline", label: "Headline", kind: "text" },
    { key: "subtext", label: "Subtext", kind: "textarea" },
    { key: "primaryLabel", label: "Primary button", kind: "text" },
    { key: "secondaryLabel", label: "Secondary button", kind: "text" },
    { key: "details", label: "Detail chips", kind: "stringList" },
  ],
  highlight: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "body", label: "Body", kind: "textarea" },
    { key: "author", label: "Author", kind: "text" },
    { key: "readTime", label: "Read time", kind: "text" },
  ],
  about: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "paragraphs", label: "Paragraphs", kind: "stringList" },
    { key: "stats", label: "Stats", kind: "itemList", item: [["value", "Value"], ["label", "Label"]] },
  ],
  featured: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "items", label: "Items", kind: "itemList", item: [["title", "Title"], ["excerpt", "Excerpt"], ["author", "Author"]] },
  ],
  events: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "items", label: "Events", kind: "itemList", item: [["title", "Title"], ["date", "Date"], ["time", "Time"], ["place", "Place"]] },
  ],
  blog: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "posts", label: "Posts", kind: "itemList", item: [["title", "Title"], ["excerpt", "Excerpt"], ["author", "Author"], ["date", "Date"]] },
  ],
  team: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "members", label: "Members", kind: "itemList", item: [["name", "Name"], ["role", "Role"]] },
  ],
  newsletter: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "body", label: "Body", kind: "textarea" },
  ],
  contact: [
    { key: "kicker", label: "Kicker", kind: "text" },
    { key: "title", label: "Title", kind: "text" },
    { key: "body", label: "Body", kind: "textarea" },
    { key: "items", label: "Details", kind: "itemList", item: [["label", "Label"], ["value", "Value"]] },
  ],
};

// Blocks that manage a list of records get the superadmin-style
// "Add … / Manage" toggle instead of a flat stacked editor.
const COLLECTION: Partial<
  Record<
    BlockType,
    {
      field: string; // which data key holds the array
      createLabel: string; // toggle "create" button label
      manageLabel: string; // heading in manage mode
      schema: [string, string][]; // [key, label] per item field
      featured?: boolean; // items can be flagged Featured (star)
    }
  >
> = {
  events: {
    field: "items",
    createLabel: "Add Event",
    manageLabel: "Events",
    schema: [
      ["title", "Title"],
      ["date", "Date"],
      ["time", "Time"],
      ["place", "Place"],
      ["description", "Description"],
    ],
    featured: true,
  },
  blog: {
    field: "posts",
    createLabel: "Add Blog",
    manageLabel: "Blog posts",
    schema: [
      ["title", "Title"],
      ["excerpt", "Excerpt"],
      ["author", "Author"],
      ["date", "Date"],
    ],
    featured: true,
  },
  featured: {
    field: "items",
    createLabel: "Add Featured",
    manageLabel: "Featured items",
    schema: [
      ["title", "Title"],
      ["excerpt", "Excerpt"],
      ["author", "Author"],
      ["meta", "Meta"],
    ],
  },
};

const DEFAULT_DATA: Record<BlockType, Record<string, any>> = {
  hero: {
    kicker: "Welcome",
    headline: "A short, bold headline goes right here.",
    subtext: "Replace this with a sentence about your chapter.",
    primaryLabel: "Primary action",
    secondaryLabel: "Secondary action",
    details: ["Detail one", "Detail two", "Detail three"],
  },
  highlight: { kicker: "Highlight", title: "Highlight Section", body: "Placeholder body text.", author: "Author name", readTime: "5 min read" },
  about: {
    kicker: "About", title: "About Section",
    paragraphs: ["First paragraph of placeholder text.", "Second paragraph."],
    stats: [{ value: "100+", label: "Metric one" }, { value: "50", label: "Metric two" }],
  },
  featured: {
    kicker: "Featured", title: "Featured Section",
    items: [
      { title: "Featured item one", excerpt: "Short excerpt.", author: "Author name", meta: "5 min read" },
      { title: "Featured item two", excerpt: "Another excerpt.", author: "Author name", meta: "6 min read" },
    ],
  },
  events: {
    kicker: "Events", title: "Events Section",
    items: [
      { title: "Beach clean-up drive", date: "Aug 12, 2026", time: "07:00 AM", place: "Puri Beach", description: "Community shoreline clean-up.", featured: true },
      { title: "Tree plantation", date: "Aug 20, 2026", time: "09:00 AM", place: "City Park", description: "Native sapling plantation." },
    ],
  },
  blog: {
    kicker: "Blog", title: "Blog Section",
    posts: [
      { title: "Why mangroves matter", excerpt: "A look at coastal ecosystems.", author: "Author name", date: "Jan 01", featured: true },
      { title: "Our first year", excerpt: "Recapping the chapter's milestones.", author: "Author name", date: "Jan 12" },
    ],
  },
  team: {
    kicker: "Team", title: "Team Section",
    members: [{ name: "Team member one", role: "Role / Title" }],
  },
  newsletter: { kicker: "Newsletter", title: "Newsletter Section", body: "Subscribe for updates." },
  contact: {
    kicker: "Contact", title: "Contact Section", body: "Get in touch.",
    items: [{ label: "Email", value: "email@example.com" }, { label: "Phone", value: "+00 000 000 0000" }],
  },
};

const INITIAL_BLOCKS: Block[] = (
  ["hero", "about", "featured", "events", "blog", "contact"] as BlockType[]
).map((type) => ({ id: uid(), type, hidden: false, data: structuredClone(DEFAULT_DATA[type]) }));

/* ------------------------------ small UI bits ---------------------------- */

const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25";
const labelCls =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500";

/* ================================== page ================================= */

export default function TestAdminPrototype() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [settings, setSettings] = useState({
    brandName: "Puri Chapter",
    tagline: "Climate action, locally.",
    accent: "#16a34a",
  });
  const [selected, setSelected] = useState<string>("settings"); // "settings" or block id
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [dirty, setDirty] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const touch = () => setDirty(true);

  const patchBlock = (id: string, data: Record<string, any>) => {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, data } : b)));
    touch();
  };
  const toggleHide = (id: string) => {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)));
    touch();
  };
  const duplicate = (id: string) => {
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      if (i < 0) return bs;
      const copy = { ...bs[i], id: uid(), data: structuredClone(bs[i].data) };
      return [...bs.slice(0, i + 1), copy, ...bs.slice(i + 1)];
    });
    touch();
  };
  const remove = (id: string) => {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
    if (selected === id) setSelected("settings");
    touch();
  };
  const addBlock = (type: BlockType) => {
    const nb: Block = { id: uid(), type, hidden: false, data: structuredClone(DEFAULT_DATA[type]) };
    setBlocks((bs) => [...bs, nb]);
    setSelected(nb.id);
    setShowPalette(false);
    touch();
  };
  const reorder = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setBlocks((bs) => {
      const from = bs.findIndex((b) => b.id === fromId);
      const to = bs.findIndex((b) => b.id === toId);
      if (from < 0 || to < 0) return bs;
      const next = [...bs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    touch();
  };

  const selectedBlock = blocks.find((b) => b.id === selected) || null;

  return (
    <div className="min-h-screen bg-[#fefaf2] text-stone-900">
      {/* Temporary-preview banner */}
      <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
        TEMPORARY PREVIEW · mock data, nothing is saved · this route is deleted when Phase 3 starts
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-stone-200 bg-white/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{ background: settings.accent }}
          >
            <Pencil className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold leading-tight">{settings.brandName}</div>
            <div className="font-mono text-[11px] text-stone-500">
              Sub-site Builder · /s/puri
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit/Preview toggle */}
          <div className="flex rounded-lg border border-stone-200 bg-white p-0.5">
            <button
              onClick={() => setMode("edit")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === "edit" ? "bg-green-600 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                mode === "preview" ? "bg-green-600 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Preview
            </button>
          </div>

          {dirty && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unpublished changes
            </span>
          )}
          <button
            onClick={() => setDirty(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            <Save className="h-4 w-4" /> Save draft
          </button>
          <button
            onClick={() => setDirty(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            <Send className="h-4 w-4" /> Publish
          </button>
        </div>
      </header>

      {mode === "preview" ? (
        <Preview blocks={blocks} settings={settings} />
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[300px_1fr]">
          {/* Left rail: outline */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
              <button
                onClick={() => setSelected("settings")}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  selected === "settings" ? "bg-green-600 text-white" : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Settings className="h-4 w-4" /> Site settings
              </button>

              <div className="my-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Sections
              </div>

              <ul className="space-y-1">
                {blocks.map((b) => {
                  const Icon = TYPE_META[b.type].icon;
                  const active = selected === b.id;
                  return (
                    <li
                      key={b.id}
                      draggable
                      onDragStart={() => setDragId(b.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragId) reorder(dragId, b.id);
                        setDragId(null);
                      }}
                      className={`group flex items-center gap-1.5 rounded-lg px-2 py-2 ${
                        active ? "bg-green-50 ring-1 ring-green-200" : "hover:bg-stone-50"
                      } ${b.hidden ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-stone-300" />
                      <button
                        onClick={() => setSelected(b.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-stone-500" />
                        <span className="truncate text-sm font-medium text-stone-700">
                          {TYPE_META[b.type].label}
                        </span>
                      </button>
                      <div className="flex items-center opacity-0 transition group-hover:opacity-100">
                        <IconBtn title={b.hidden ? "Show" : "Hide"} onClick={() => toggleHide(b.id)}>
                          {b.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </IconBtn>
                        <IconBtn title="Duplicate" onClick={() => duplicate(b.id)}>
                          <Copy className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Delete" danger onClick={() => remove(b.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Add section */}
              <div className="relative mt-2">
                <button
                  onClick={() => setShowPalette((v) => !v)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 px-3 py-2.5 text-sm font-medium text-stone-600 hover:border-green-500 hover:text-green-700"
                >
                  <Plus className="h-4 w-4" /> Add section
                </button>
                {showPalette && (
                  <div className="absolute z-10 mt-1 grid w-full grid-cols-2 gap-1 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
                    {(Object.keys(TYPE_META) as BlockType[]).map((t) => {
                      const Icon = TYPE_META[t].icon;
                      return (
                        <button
                          key={t}
                          onClick={() => addBlock(t)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-stone-700 hover:bg-green-50 hover:text-green-700"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {TYPE_META[t].label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Editor */}
          <main className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            {selected === "settings" ? (
              <SettingsEditor settings={settings} onChange={(s) => { setSettings(s); touch(); }} />
            ) : selectedBlock ? (
              <BlockEditor
                key={selectedBlock.id}
                block={selectedBlock}
                onChange={(data) => patchBlock(selectedBlock.id, data)}
                onBack={() => setSelected("settings")}
              />
            ) : (
              <div className="py-20 text-center text-stone-500">Select a section to edit.</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ sub-components ---------------------------- */

function IconBtn({
  children, onClick, title, danger,
}: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded p-1 text-stone-400 transition hover:bg-stone-200 ${
        danger ? "hover:text-red-600" : "hover:text-stone-700"
      }`}
    >
      {children}
    </button>
  );
}

function SettingsEditor({
  settings, onChange,
}: { settings: any; onChange: (s: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...settings, [k]: v });
  return (
    <div className="max-w-lg space-y-5">
      <h2 className="text-lg font-semibold">Site settings</h2>
      <div>
        <label className={labelCls}>Brand name</label>
        <input className={inputCls} value={settings.brandName} onChange={(e) => set("brandName", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Tagline</label>
        <input className={inputCls} value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Accent color</label>
        <div className="flex items-center gap-3">
          <input type="color" value={settings.accent} onChange={(e) => set("accent", e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-stone-200" />
          <input className={inputCls} value={settings.accent} onChange={(e) => set("accent", e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-stone-400">
        (Prototype) Logo, nav links, footer and socials would live here too.
      </p>
    </div>
  );
}

function BlockEditor({
  block, onChange, onBack,
}: { block: Block; onChange: (data: Record<string, any>) => void; onBack: () => void }) {
  const fields = FIELDS[block.type];
  const set = (k: string, v: any) => onChange({ ...block.data, [k]: v });
  const Icon = TYPE_META[block.type].icon;

  return (
    <div className="max-w-2xl">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 lg:hidden">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">{TYPE_META[block.type].label} section</h2>
      </div>

      <div className="space-y-5">
        {fields.map((f) => {
          const collection = COLLECTION[block.type];
          const isCollectionField =
            f.kind === "itemList" && collection?.field === f.key;
          return (
            <div key={f.key}>
              {!isCollectionField && <label className={labelCls}>{f.label}</label>}
              {f.kind === "text" && (
                <input className={inputCls} value={block.data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
              )}
              {f.kind === "textarea" && (
                <textarea rows={3} className={inputCls} value={block.data[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
              )}
              {f.kind === "stringList" && (
                <StringListEditor values={block.data[f.key] ?? []} onChange={(v) => set(f.key, v)} />
              )}
              {f.kind === "itemList" &&
                (isCollectionField && collection ? (
                  <CollectionEditor
                    items={block.data[f.key] ?? []}
                    schema={collection.schema}
                    createLabel={collection.createLabel}
                    manageLabel={collection.manageLabel}
                    featured={collection.featured}
                    onChange={(v) => set(f.key, v)}
                  />
                ) : (
                  <ItemListEditor
                    items={block.data[f.key] ?? []}
                    schema={(f as any).item}
                    onChange={(v) => set(f.key, v)}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StringListEditor({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {values.map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={inputCls} value={val}
            onChange={(e) => onChange(values.map((v, j) => (j === i ? e.target.value : v)))} />
          <IconBtn title="Remove" danger onClick={() => onChange(values.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      ))}
      <button onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
        <Plus className="h-4 w-4" /> Add
      </button>
    </div>
  );
}

function ItemListEditor({
  items, schema, onChange,
}: { items: Record<string, any>[]; schema: [string, string][]; onChange: (v: any[]) => void }) {
  const blank = () => Object.fromEntries(schema.map(([k]) => [k, ""]));
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Item {i + 1}</span>
            <IconBtn title="Remove" danger onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </IconBtn>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {schema.map(([k, lbl]) => (
              <div key={k}>
                <label className="mb-1 block text-[11px] text-stone-500">{lbl}</label>
                <input className={inputCls} value={it[k] ?? ""}
                  onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, blank()])}
        className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
}

/**
 * Superadmin-style "Add … / Manage" collection editor for the events, blog and
 * featured blocks. Mirrors components/admin/sections/*Section.tsx: a SectionToggle
 * switches between an add/edit form (create) and a searchable list (manage).
 */
function CollectionEditor({
  items,
  schema,
  createLabel,
  manageLabel,
  featured,
  onChange,
}: {
  items: Record<string, any>[];
  schema: [string, string][];
  createLabel: string;
  manageLabel: string;
  featured?: boolean;
  onChange: (v: any[]) => void;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const titleKey = schema[0][0];
  const blank = () => Object.fromEntries(schema.map(([k]) => [k, ""]));

  const startAdd = () => {
    setDraft(blank());
    setEditIndex(null);
    setMode("create");
  };
  const startEdit = (i: number) => {
    setDraft({ ...items[i] });
    setEditIndex(i);
    setMode("create");
  };
  const save = () => {
    if (editIndex === null) onChange([...items, draft]);
    else onChange(items.map((x, j) => (j === editIndex ? draft : x)));
    setMode("manage");
  };
  const del = (i: number) => onChange(items.filter((_, j) => j !== i));
  const setField = (k: string, v: any) => setDraft((d) => ({ ...d, [k]: v }));

  const q = search.trim().toLowerCase();
  const shown = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => matches(q, [it[titleKey], it.author, it.place]));

  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={(m) => (m === "create" ? startAdd() : setMode("manage"))}
        count={items.length}
        createLabel={createLabel}
      />

      {mode === "create" ? (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-800">
              {editIndex === null ? createLabel : "Edit item"}
            </h3>
            <button
              onClick={() => setMode("manage")}
              className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
              title="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {schema.map(([k, lbl]) => (
              <div key={k} className={k === "description" || k === "excerpt" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-[11px] text-stone-500">{lbl}</label>
                <input className={inputCls} value={draft[k] ?? ""} onChange={(e) => setField(k, e.target.value)} />
              </div>
            ))}
          </div>
          {featured && (
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={!!draft.featured}
                onChange={(e) => setField("featured", e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-green-600 focus:ring-green-600/40"
              />
              <Star className="h-4 w-4 text-amber-500" /> Mark as featured
            </label>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setMode("manage")}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              {editIndex === null ? "Add" : "Save changes"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <SectionHeading
            title={manageLabel}
            count={items.length}
            right={
              items.length > 0 ? (
                <SearchBar value={search} onChange={setSearch} placeholder={`Search ${manageLabel.toLowerCase()}…`} />
              ) : undefined
            }
          />
          {items.length === 0 ? (
            <EmptyState message={`No ${manageLabel.toLowerCase()} yet. Use “${createLabel}”.`} />
          ) : shown.length === 0 ? (
            <EmptyState message={`No ${manageLabel.toLowerCase()} match “${search}”.`} />
          ) : (
            <div className="space-y-3">
              {shown.map(({ it, i }) => (
                <div
                  key={i}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-green-600/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{it[titleKey] || "Untitled"}</span>
                      {featured && it.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-mono text-xs text-stone-500">
                      {schema.slice(1).map(([k]) => it[k]).filter(Boolean).join(" • ")}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => startEdit(i)}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                      Edit
                    </button>
                    <IconBtn title="Delete" danger onClick={() => del(i)}>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------- lightweight preview ------------------------- */

function Preview({ blocks, settings }: { blocks: Block[]; settings: any }) {
  const visible = blocks.filter((b) => !b.hidden);
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8 rounded-xl border border-dashed border-stone-300 bg-white/60 px-4 py-2 text-center text-xs text-stone-500">
        Draft preview — this is what visitors would see after Publish
      </div>
      {visible.map((b) => (
        <PreviewBlock key={b.id} block={b} accent={settings.accent} />
      ))}
      {visible.length === 0 && (
        <p className="py-20 text-center text-stone-400">All sections are hidden.</p>
      )}
    </div>
  );
}

function Kicker({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
      <span className="h-px w-6" style={{ background: accent }} />
      {children}
    </span>
  );
}

function PreviewBlock({ block, accent }: { block: Block; accent: string }) {
  const d = block.data;
  const card = "rounded-lg border border-stone-200 bg-white p-4 shadow-sm";
  switch (block.type) {
    case "hero":
      return (
        <section className="py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">{d.headline}</h1>
          <p className="mt-4 max-w-2xl text-stone-600">{d.subtext}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {d.primaryLabel && <span className="rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: accent }}>{d.primaryLabel}</span>}
            {d.secondaryLabel && <span className="rounded-full border px-5 py-2.5 text-sm font-semibold" style={{ borderColor: accent, color: accent }}>{d.secondaryLabel}</span>}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
            {(d.details ?? []).map((x: string, i: number) => <span key={i}>{x}</span>)}
          </div>
        </section>
      );
    case "about":
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{d.title}</h2>
          <div className="mt-4 space-y-3 text-stone-700">
            {(d.paragraphs ?? []).map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {(d.stats ?? []).map((s: any, i: number) => (
              <div key={i}><div className="text-3xl font-bold">{s.value}</div><div className="text-sm text-stone-500">{s.label}</div></div>
            ))}
          </div>
        </section>
      );
    case "featured":
    case "blog": {
      const items = d.items ?? d.posts ?? [];
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 mb-6 text-3xl font-bold tracking-tight">{d.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it: any, i: number) => (
              <div key={i} className={card}>
                <div className="mb-3 h-28 rounded bg-gradient-to-br from-stone-200 to-stone-300" />
                <h3 className="flex items-center gap-1.5 font-semibold">
                  {it.title}
                  {it.featured && <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">{it.excerpt}</p>
                <p className="mt-2 text-xs text-stone-400">{it.author} {it.date ? `· ${it.date}` : ""}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "events":
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 mb-6 text-3xl font-bold tracking-tight">{d.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(d.items ?? []).map((it: any, i: number) => (
              <div key={i} className={card}>
                <h3 className="flex items-center gap-1.5 font-semibold">
                  {it.title}
                  {it.featured && <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />}
                </h3>
                <p className="mt-1 text-sm text-stone-500">{it.date} · {it.time}</p>
                <p className="text-sm text-stone-500">{it.place}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "team":
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 mb-6 text-3xl font-bold tracking-tight">{d.title}</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {(d.members ?? []).map((m: any, i: number) => (
              <div key={i}>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-stone-200 to-stone-300" />
                <div className="mt-2 font-semibold">{m.name}</div>
                <div className="text-sm text-stone-500">{m.role}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case "highlight":
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{d.title}</h2>
          <p className="mt-3 max-w-2xl text-stone-600">{d.body}</p>
          <p className="mt-3 text-sm text-stone-400">By {d.author} · {d.readTime}</p>
        </section>
      );
    case "newsletter":
      return (
        <section className="my-10 rounded-2xl px-6 py-10 text-white" style={{ background: accent }}>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{d.kicker}</div>
          <h2 className="mt-3 text-3xl font-bold">{d.title}</h2>
          <p className="mt-3 max-w-xl text-white/85">{d.body}</p>
          <div className="mt-5 flex max-w-md gap-2">
            <span className="flex-1 rounded-full bg-white/15 px-4 py-2.5 text-sm text-white/70">you@example.com</span>
            <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold" style={{ color: accent }}>Subscribe</span>
          </div>
        </section>
      );
    case "contact":
      return (
        <section className="border-t border-stone-100 py-10">
          <Kicker accent={accent}>{d.kicker}</Kicker>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{d.title}</h2>
          <p className="mt-3 text-stone-600">{d.body}</p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {(d.items ?? []).map((it: any, i: number) => (
              <div key={i} className={card}>
                <dt className="text-xs uppercase tracking-wide text-stone-400">{it.label}</dt>
                <dd className="mt-1 font-medium">{it.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    default:
      return null;
  }
}
