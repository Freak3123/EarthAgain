"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Save,
  ExternalLink,
  LogOut,
  Settings as SettingsIcon,
  LayoutTemplate,
  BookOpen,
  CalendarDays,
  Star,
  Leaf,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { IBlock, IBlockBorder, BlockType, ISiteSettings } from "@/lib/models/site";
import { blockRegistry } from "@/lib/blocks/registry";
import { defaultBlockStyle } from "@/lib/blocks/defaults";
import { BlogsSection } from "@/components/admin/sections/BlogsSection";
import { EventsSection } from "@/components/admin/sections/EventsSection";
import BlockListPane from "./BlockListPane";
import SettingsPanel from "./SettingsPanel";
import BorderField from "./BorderField";
import FeaturedTab from "./FeaturedTab";

/**
 * The sub-site builder — the subadmin's entire /admin experience (design §4).
 * Three panes: block list (left), block editor (middle), settings + actions
 * (top bar). Loads/saves draft.blocks + settings via /api/site/draft; Preview
 * and Publish (Phase 5) both require a clean save first, so what the admin
 * previews and publishes always matches what's actually stored.
 *
 * Blog and Events are a separate concern from the block builder: they reuse
 * the exact same collections/forms/routes as the main site (BlogsSection,
 * EventsSection, /api/admin/save-blogs, etc.), scoped to this site via
 * /api/site/blogs and /api/site/events. Unlike draft.blocks, posting a blog
 * or event goes live immediately — there's no draft/publish step for them.
 */

type Tab = "content" | "blog" | "events" | "featured" | "settings";

function newBlockId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blk_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export default function SubsiteBuilder() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [hasPublished, setHasPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [blogs, setBlogs] = useState<unknown[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsLoaded, setBlogsLoaded] = useState(false);
  const [blogSearch, setBlogSearch] = useState("");
  const [events, setEvents] = useState<unknown[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [eventSearch, setEventSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/site/draft");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load your site");
        setSiteId(data.siteId);
        setSlug(data.slug);
        setSettings(data.settings);
        setBlocks(data.blocks || []);
        setSelectedId(data.blocks?.[0]?.id ?? null);
        setHasPublished(!!data.hasPublished);
        setPublishedAt(data.publishedAt ? new Date(data.publishedAt) : null);
      } catch (e: any) {
        setError(e.message || "Failed to load your site");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markDirty = () => setDirty(true);

  const updateBlockData = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
    markDirty();
  }, []);

  const updateBlockBorder = useCallback((id: string, border: IBlockBorder) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, style: { ...b.style, border } } : b))
    );
    markDirty();
  }, []);

  const toggleHidden = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)));
    markDirty();
  };

  const duplicateBlock = (id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const copy: IBlock = {
        ...prev[idx],
        id: newBlockId(),
        data: structuredClone(prev[idx].data),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      setSelectedId(copy.id);
      return next;
    });
    markDirty();
  };

  const deleteBlock = (id: string) => {
    if (!confirm("Delete this section? This can't be undone until you publish.")) return;
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
    markDirty();
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
    markDirty();
  };

  const addBlock = (type: BlockType) => {
    const entry = blockRegistry[type];
    const block: IBlock = {
      id: newBlockId(),
      type,
      hidden: false,
      data: structuredClone(entry.defaultData),
      style: defaultBlockStyle(),
    };
    setBlocks((prev) => {
      const idx = selectedId ? prev.findIndex((b) => b.id === selectedId) : prev.length - 1;
      const next = [...prev];
      next.splice(idx + 1, 0, block);
      return next;
    });
    setSelectedId(block.id);
    setTab("content");
    markDirty();
  };

  const updateSettings = (next: ISiteSettings) => {
    setSettings(next);
    markDirty();
  };

  const saveDraft = async () => {
    if (!siteId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/site/draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, blocks, settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setDirty(false);
      setSavedAt(new Date());
    } catch (e: any) {
      alert(e.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch("/api/site/blogs");
      const data = await res.json();
      setBlogs(res.ok ? data : []);
    } catch {
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
      setBlogsLoaded(true);
    }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch("/api/site/events");
      const data = await res.json();
      setEvents(res.ok ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setEventsLoading(false);
      setEventsLoaded(true);
    }
  };

  const openTab = (next: Tab) => {
    setTab(next);
    if ((next === "blog" || next === "featured") && !blogsLoaded) fetchBlogs();
    if ((next === "events" || next === "featured") && !eventsLoaded) fetchEvents();
  };

  const refreshFeatured = async () => {
    await Promise.all([fetchBlogs(), fetchEvents()]);
  };

  const publishSite = async () => {
    if (!siteId) return;
    const message = hasPublished
      ? "Publish these changes? They'll immediately replace what's live."
      : "Publish this site? It will become publicly visible.";
    if (!confirm(message)) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/site/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      setHasPublished(true);
      setPublishedAt(new Date(data.publishedAt));
    } catch (e: any) {
      alert(e.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fefaf2]">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          <span className="text-sm font-medium">Loading your site…</span>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fefaf2] px-6">
        <div className="max-w-sm rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Couldn&apos;t load your site</p>
          <p className="mt-1 text-sm text-red-600">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;
  const selectedEntry = selectedBlock ? blockRegistry[selectedBlock.type] : null;

  return (
    // pt-24 clears the main site's fixed Navbar (same convention used by the
    // superadmin console's pt-28) — without it, this header renders right
    // under the overlay and Save/Publish become invisible, not just offset.
    <div className="flex h-screen flex-col bg-[#fefaf2] pt-24">
      {/* -------------------------------- TOP BAR -------------------------------- */}
      {/* sticky (not just shrink-0) so it stays pinned right below the main
          Navbar regardless of how the content below it scrolls — top-24
          matches the wrapper's pt-24 so it locks into that exact spot. */}
      <header className="sticky top-24 z-30 flex shrink-0 items-center justify-between gap-4 border-b border-stone-200 bg-white/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#79b727] text-white shadow-sm shadow-green-600/20">
            <Leaf className="h-4.5 w-4.5" />
          </span>
          <div>
            <h1 className="text-sm font-bold leading-tight text-stone-900">Site Builder</h1>
            <p className="font-mono text-xs text-stone-500">/s/{slug}</p>
          </div>
        </div>

        <div className="inline-flex gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1">
          <TabButton active={tab === "content"} onClick={() => openTab("content")} icon={LayoutTemplate}>
            Content
          </TabButton>
          <TabButton active={tab === "blog"} onClick={() => openTab("blog")} icon={BookOpen}>
            Blog
          </TabButton>
          <TabButton active={tab === "events"} onClick={() => openTab("events")} icon={CalendarDays}>
            Events
          </TabButton>
          <TabButton active={tab === "featured"} onClick={() => openTab("featured")} icon={Star}>
            Featured
          </TabButton>
          <TabButton active={tab === "settings"} onClick={() => openTab("settings")} icon={SettingsIcon}>
            Site Settings
          </TabButton>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden flex-col items-end leading-tight sm:flex">
            <span className="text-xs text-stone-400">
              {dirty
                ? "Unpublished changes"
                : savedAt
                ? `Saved ${savedAt.toLocaleTimeString()}`
                : "No changes yet"}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                hasPublished ? "text-green-600" : "text-stone-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasPublished ? "bg-green-500" : "bg-stone-300"
                }`}
              />
              {hasPublished
                ? `Live${publishedAt ? ` · published ${publishedAt.toLocaleString()}` : ""}`
                : "Not published yet"}
            </span>
          </div>
          <a
            href={dirty ? undefined : `/s/${slug}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={dirty}
            title={dirty ? "Save your draft to preview" : "Open draft preview"}
            onClick={(e) => {
              if (dirty) e.preventDefault();
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium transition ${
              dirty
                ? "cursor-not-allowed text-stone-300"
                : "cursor-pointer text-stone-600 hover:bg-stone-50"
            }`}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </a>
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving || !dirty}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#79b727] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#338c20] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Draft
          </button>
          <button
            type="button"
            onClick={publishSite}
            disabled={publishing || dirty}
            title={dirty ? "Save your draft before publishing" : "Publish"}
            className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-green-600 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-300 disabled:hover:bg-transparent sm:inline-flex"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            aria-label="Logout"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-stone-200 p-2 text-stone-500 transition hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* -------------------------------- BODY -------------------------------- */}
      {tab === "settings" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <SettingsPanel settings={settings} onChange={updateSettings} />
        </div>
      ) : tab === "blog" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <BlogsSection
              blogs={blogs}
              loading={blogsLoading}
              search={blogSearch}
              onSearch={setBlogSearch}
              onRefresh={fetchBlogs}
              formMode="site"
              showSiteFilter={false}
              allowBulkDelete={false}
            />
          </div>
        </div>
      ) : tab === "events" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <EventsSection
              events={events}
              loading={eventsLoading}
              search={eventSearch}
              onSearch={setEventSearch}
              onRefresh={fetchEvents}
              formMode="site"
              showSiteFilter={false}
              allowBulkDelete={false}
            />
          </div>
        </div>
      ) : tab === "featured" ? (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <FeaturedTab
              blogs={blogs}
              events={events}
              loading={blogsLoading || eventsLoading}
              onRefresh={refreshFeatured}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-72 shrink-0 border-r border-stone-200 bg-white">
            <BlockListPane
              blocks={blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onToggleHidden={toggleHidden}
              onDuplicate={duplicateBlock}
              onDelete={deleteBlock}
              onMove={moveBlock}
              onAdd={addBlock}
            />
          </aside>

          <main className="flex-1 overflow-y-auto p-8">
            {selectedBlock && selectedEntry ? (
              <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <selectedEntry.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-stone-900">
                      {selectedEntry.label}
                    </h2>
                    <p className="text-xs text-stone-500">{selectedEntry.description}</p>
                  </div>
                </div>
                <selectedEntry.editor
                  data={selectedBlock.data as never}
                  onChange={(data) => updateBlockData(selectedBlock.id, data as Record<string, unknown>)}
                />

                <div className="mt-6 border-t border-stone-200 pt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Section border
                  </h3>
                  <BorderField
                    border={selectedBlock.style?.border}
                    onChange={(border) => updateBlockBorder(selectedBlock.id, border)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-stone-400">
                <div>
                  <LayoutTemplate className="mx-auto mb-3 h-8 w-8" />
                  <p className="text-sm">Select a section to edit, or add a new one.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
