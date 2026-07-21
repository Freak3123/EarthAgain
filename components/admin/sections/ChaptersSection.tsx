"use client";
import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  Check,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDataList, Column, FormRecord } from "../FormDataList";
import { prettify, ContactCell, LinkCell } from "../cells";
import { slugify } from "@/lib/utils/slugify";

interface GeneratedCredentials {
  username: string;
  password: string;
  slug: string;
  url: string;
}

const statusBadge = (status?: string) => {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-stone-100 text-stone-500",
  };
  const s = status || "pending";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        map[s] || map.pending
      }`}
    >
      {prettify(s)}
    </span>
  );
};

export function ChaptersSection({
  chapters,
  loading,
  search,
  onSearch,
  onRefresh,
}: {
  chapters: any[];
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  // Approve dialog state
  const [approving, setApproving] = useState<any | null>(null);
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Credentials panel (shown once after approval)
  const [creds, setCreds] = useState<GeneratedCredentials | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const openApprove = (chapter: any) => {
    setError("");
    setApproving(chapter);
    setSlug(
      slugify(chapter.entityName || chapter.instituteName || chapter.name || "")
    );
  };

  const confirmApprove = async () => {
    if (!approving) return;
    setBusy(true);
    setError("");
    try {
      const res = await axios.post("/api/admin/approve-chapter", {
        chapterId: approving._id,
        slug: slug || undefined,
      });
      setApproving(null);
      setCreds(res.data.credentials
        ? { ...res.data.credentials, slug: res.data.slug, url: res.data.url }
        : null);
      await onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to approve chapter.");
    } finally {
      setBusy(false);
    }
  };

  const reject = async (chapter: any) => {
    if (
      !window.confirm(
        `Reject the chapter request from "${chapter.name}"? No sub-site will be created.`
      )
    )
      return;
    try {
      await axios.post("/api/admin/reject-chapter", { chapterId: chapter._id });
      await onRefresh();
    } catch {
      alert("Failed to reject chapter.");
    }
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const columns = [
    {
      header: "Name",
      cell: (c) => c.name as string,
      csv: (c) => (c.name as string) || "",
    },
    {
      header: "Contact",
      cell: (c) => (
        <ContactCell email={c.email as string} phone={c.phone as string} />
      ),
      csv: (c) => `${c.email ?? ""} / ${c.phone ?? ""}`,
    },
    {
      header: "Type",
      cell: (c) => prettify(c.type as string),
      csv: (c) => prettify(c.type as string),
    },
    {
      header: "Entity / Institute",
      cell: (c) =>
        (c.entityName as string) || (c.instituteName as string) || "—",
      csv: (c) =>
        (c.entityName as string) || (c.instituteName as string) || "",
    },
    {
      header: "Social",
      cell: (c) => <LinkCell href={c.socialLink as string} />,
      csv: (c) => (c.socialLink as string) || "",
    },
    {
      header: "Status",
      cell: (c) => statusBadge(c.status as string),
      csv: (c) => (c.status as string) || "pending",
    },
  ] as Column<FormRecord>[];

  const renderRowActions = (c: any) => {
    // Approved chapters are managed from the Sites tab; nothing to do here.
    if (c.status === "approved") return null;
    if (c.status === "rejected") {
      return <span className="text-xs text-stone-400">Rejected</span>;
    }
    // pending
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-green-700 hover:bg-green-50"
          title={`Approve ${c.name}`}
          onClick={() => openApprove(c)}
        >
          <Check className="h-4 w-4" />
          Approve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-stone-500 hover:bg-red-50 hover:text-red-600"
          title={`Reject ${c.name}`}
          onClick={() => reject(c)}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </>
    );
  };

  return (
    <>
      <FormDataList
        title="Chapters"
        statLabel="Total chapters"
        statIcon={MapPin}
        items={chapters}
        loading={loading}
        search={search}
        onSearch={onSearch}
        onRefresh={onRefresh}
        deleteEndpoint="/api/admin/delete-chapter"
        csvName="chapters.csv"
        getLabel={(c) => (c.name as string) || "this chapter"}
        searchFields={(c) => [
          c.name as string,
          c.email as string,
          c.phone as string,
          c.entityName as string,
          c.instituteName as string,
        ]}
        columns={columns}
        renderRowActions={renderRowActions}
      />

      {/* Approve dialog — confirm/edit slug */}
      {approving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-900">
              Approve “{approving.name}”
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              This creates the sub-site and an admin login. Confirm the URL slug:
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
                Site slug
              </label>
              <div className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 text-sm">
                <span className="text-stone-400">/s/</span>
                <input
                  autoFocus
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="chapter-name"
                  className="flex-1 text-stone-800 focus:outline-none"
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-stone-300"
                onClick={() => setApproving(null)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={confirmApprove}
                disabled={busy || !slug}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve & create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials panel — shown once */}
      {creds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  Sub-site created
                </h3>
                <p className="text-sm text-stone-500">
                  Copy these now — the password is shown only once.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "Username", value: creds.username },
                { label: "Password", value: creds.password },
                { label: "Site URL", value: creds.url },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-stone-400">
                      {row.label}
                    </div>
                    <div className="truncate font-mono text-sm text-stone-800">
                      {row.value}
                    </div>
                  </div>
                  <button
                    onClick={() => copy(row.label, row.value)}
                    className="shrink-0 rounded p-1.5 text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
                    title={`Copy ${row.label}`}
                  >
                    {copied === row.label ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <a
                href={creds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800"
              >
                <ExternalLink className="h-4 w-4" />
                Open site
              </a>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setCreds(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
