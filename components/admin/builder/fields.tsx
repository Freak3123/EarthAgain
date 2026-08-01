"use client";
import React, { useRef, useState } from "react";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { label as labelCls, input as inputCls } from "@/components/admin/shared";

/* -------------------------------------------------------------------------- */
/*  Generic form-field primitives for the block editors (Phase 4).            */
/*  Reuses the admin console's "Cultivated Console" tokens (shared.tsx).      */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`${inputCls} resize-y`}
      />
    </Field>
  );
}

/** Image field: paste a URL, or upload a file via the existing /api/upload endpoint. */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("title", file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/upload", { method: "POST", body: payload });
      const data = await res.json();
      if (res.ok && data.filePath) onChange(data.filePath);
      else alert(data.error || "Upload failed");
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL, or upload →"
          className={inputCls}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium text-stone-600 transition hover:border-green-500 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Upload
        </button>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-24 w-full rounded-lg border border-stone-200 object-cover"
        />
      )}
    </Field>
  );
}

/** Editable list of plain strings (e.g. hero details, about paragraphs). */
export function StringListField({
  label,
  values,
  onChange,
  itemPlaceholder,
  multiline = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  itemPlaceholder?: string;
  multiline?: boolean;
}) {
  const list = Array.isArray(values) ? values : [];
  const update = (i: number, v: string) => {
    const next = [...list];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, ""]);

  return (
    <Field label={label}>
      <div className="space-y-2">
        {list.map((v, i) =>
          multiline ? (
            <div key={i} className="flex gap-2">
              <textarea
                value={v}
                onChange={(e) => update(i, e.target.value)}
                placeholder={itemPlaceholder}
                rows={2}
                className={`${inputCls} resize-y`}
              />
              <RemoveButton onClick={() => remove(i)} />
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={v}
                onChange={(e) => update(i, e.target.value)}
                placeholder={itemPlaceholder}
                className={inputCls}
              />
              <RemoveButton onClick={() => remove(i)} />
            </div>
          )
        )}
        <AddButton onClick={add} label="Add" />
      </div>
    </Field>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white px-2.5 text-stone-400 transition hover:border-red-300 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-green-500 hover:text-green-700"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/**
 * A repeatable list of typed objects (featured items, events, team members…).
 * Each entry renders in its own bordered card via `renderItem`, with a header
 * (label + remove) and an "Add" footer button.
 */
export function RepeaterField<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
  itemLabel,
  addLabel = "Add item",
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
}) {
  const list = Array.isArray(items) ? items : [];
  const update = (i: number, patch: Partial<T>) => {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, newItem()]);

  return (
    <Field label={label}>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="rounded-lg border border-stone-200 bg-stone-50/60 p-3">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500">
                {itemLabel(item, i) || `Item ${i + 1}`}
              </span>
              <RemoveButton onClick={() => remove(i)} />
            </div>
            <div className="space-y-2.5">{renderItem(item, (patch) => update(i, patch))}</div>
          </div>
        ))}
        <AddButton onClick={add} label={addLabel} />
      </div>
    </Field>
  );
}
