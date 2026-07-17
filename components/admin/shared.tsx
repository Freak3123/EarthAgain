"use client";
import React from "react";
import { Search, X, Loader2, Inbox, Plus, LayoutList } from "lucide-react";

/* ------------------------------- types -------------------------------- */
export interface IEvent {
  title: string;
  date: Date;
  time: string;
  location: string;
  district: string;
  type: string;
  attendees: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface SpeakerFormData {
  name: string;
  session: string;
  image: string;
  isFeatured: boolean;
}

export interface ClimatePanchayatFormData {
  title: string;
  date: Date;
  // time: string;
  // location: string;
  // organizerName: string;
  // attendees: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface RegEventFormData {
  title: string;
  date: string;
  time: string;
  description: string;
  speakers: string[];
}

//same as above but for fetching event name...
export interface IEventRef {
  _id: string;
  title: string;
  date: Date;
  time: string;
}

export interface IRegistration {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  age: "under-18" | "18-25" | "26-35" | "36-50" | "above-50";
  district:
    | "bhubaneswar"
    | "cuttack"
    | "puri"
    | "berhampur"
    | "rourkela"
    | "sambalpur"
    | "other";
  registrationDays: string[];
  selectedEvents: IEventRef[];
  createdAt: Date; // ISO date string when fetched from API
}

export interface ISpeaker {
  _id?: string;
  name: string;
  session: string;
  image?: string;
  isFeatured: boolean;
  createdAt?: string;
}

/* --------------------------- design tokens ---------------------------- */
/* -------------------------------------------------------------------------- */
/*  Shared design tokens — "Cultivated Console"                               */
/*  Forest green on warm cream, hairline borders, monospace metadata.         */
/* -------------------------------------------------------------------------- */
export const label =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500";
export const input =
  "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 transition focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25";
export const fileInput =
  "w-full cursor-pointer rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-600 transition hover:border-green-500 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-green-700";
export const submitBtn =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/40 disabled:cursor-not-allowed disabled:opacity-60";
export const checkbox =
  "h-4 w-4 rounded border-stone-300 text-green-600 focus:ring-green-600/40";
export const panel = "rounded-xl border border-stone-200/80 bg-white shadow-sm";
export const listCard =
  "group flex flex-col gap-4 rounded-xl border border-stone-200/80 bg-white p-5 shadow-sm transition hover:border-green-600/40 hover:shadow-md md:flex-row md:items-center md:justify-between";

/* ------------------------------ helpers ------------------------------- */
// Case-insensitive "does any field contain the query" test. Empty query matches all.
export const matches = (q: string, fields: (string | undefined | null)[]) =>
  !q ||
  fields
    .filter(Boolean)
    .some((f) => String(f).toLowerCase().includes(q));

// Escape a value for safe CSV output.
export const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/* --------------------------- presentational --------------------------- */

export const FormShell = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="mx-auto w-full max-w-xl">
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-green-600 to-emerald-500" />
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-100">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  </div>
);

export const SectionHeading = ({
  title,
  count,
  right,
}: {
  title: string;
  count?: number;
  right?: React.ReactNode;
}) => (
  <div className="mb-6 flex flex-wrap items-center gap-3">
    <div className="h-6 w-1 rounded-full bg-green-600" />
    <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
    {typeof count === "number" && (
      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
        {count}
      </span>
    )}
    {right && <div className="ml-auto">{right}</div>}
  </div>
);

export const SearchBar = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="relative w-full sm:w-72">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-10 pr-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
        aria-label="Clear search"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

export const ListLoading = () => (
  <div className="flex items-center justify-center gap-2 py-16 text-stone-500">
    <Loader2 className="h-5 w-5 animate-spin text-green-600" />
    <span className="text-sm">Loading…</span>
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-dashed border-stone-300 bg-white/50 py-14 text-center">
    <Inbox className="mx-auto mb-3 h-8 w-8 text-stone-300" />
    <p className="text-sm text-stone-500">{message}</p>
  </div>
);

export const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <div className="text-2xl font-bold leading-tight text-stone-900">
        {value}
      </div>
      <div className="truncate text-xs text-stone-500">{label}</div>
    </div>
  </div>
);

/* ----------------------- section mode toggle -------------------------- */
export type SectionMode = "manage" | "create";

export const SectionToggle = ({
  mode,
  onMode,
  count,
  createLabel = "Add New",
}: {
  mode: SectionMode;
  onMode: (m: SectionMode) => void;
  count: number;
  createLabel?: string;
}) => {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40";
  return (
    <div className="mb-8 inline-flex gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        aria-pressed={mode === "create"}
        onClick={() => onMode("create")}
        className={`${base} ${
          mode === "create"
            ? "bg-green-600 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        <Plus className="h-4 w-4" />
        {createLabel}
      </button>
      <button
        type="button"
        aria-pressed={mode === "manage"}
        onClick={() => onMode("manage")}
        className={`${base} ${
          mode === "manage"
            ? "bg-green-600 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        <LayoutList className="h-4 w-4" />
        Manage
        <span
          className={`rounded-full px-1.5 text-xs font-semibold ${
            mode === "manage"
              ? "bg-white/25 text-white"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {count}
        </span>
      </button>
    </div>
  );
};
