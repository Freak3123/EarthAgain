"use client";
import React, { useState } from "react";
import {
  Search,
  X,
  Loader2,
  Inbox,
  Plus,
  LayoutList,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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

/* ------------------------- older / new period split -------------------- */
export const CUTOFF_YEAR = 2026;
export const CUTOFF_DATE = new Date(`${CUTOFF_YEAR}-01-01T00:00:00.000Z`);

// True when the given date falls before the CUTOFF_YEAR boundary.
export const isOlderThanCutoff = (value: unknown) => {
  if (!value) return false;
  const t = new Date(value as string | Date).getTime();
  return !Number.isNaN(t) && t < CUTOFF_DATE.getTime();
};

export type PeriodView = "new" | "older";

export const PeriodToggle = ({
  view,
  onView,
  newCount,
  olderCount,
}: {
  view: PeriodView;
  onView: (v: PeriodView) => void;
  newCount: number;
  olderCount: number;
}) => {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40";
  const countBadge = (active: boolean) =>
    `rounded-full px-1.5 text-xs font-semibold ${
      active ? "bg-white/25 text-white" : "bg-stone-100 text-stone-500"
    }`;
  return (
    <div className="inline-flex gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        aria-pressed={view === "new"}
        onClick={() => onView("new")}
        className={`${base} ${
          view === "new"
            ? "bg-green-600 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        New
        <span className={countBadge(view === "new")}>{newCount}</span>
      </button>
      <button
        type="button"
        aria-pressed={view === "older"}
        onClick={() => onView("older")}
        className={`${base} ${
          view === "older"
            ? "bg-green-600 text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        Older
        <span className={countBadge(view === "older")}>{olderCount}</span>
      </button>
    </div>
  );
};

/**
 * "Delete All" control shown in the Older view: a destructive button that
 * opens a warning dialog before permanently removing every pre-cutoff entry
 * in the current category via `onDeleteAll`.
 */
export const DeleteAllOlderButton = ({
  onDeleteAll,
  disabled,
}: {
  onDeleteAll: () => Promise<void>;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onDeleteAll();
      setOpen(false);
    } catch {
      alert("Failed to delete older entries.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="gap-1.5"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete All
      </Button>
      <Dialog open={open} onOpenChange={(v) => !busy && setOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>Delete all entries before {CUTOFF_YEAR}?</DialogTitle>
            <DialogDescription>
              Remember, this will remove all entries before {CUTOFF_YEAR}{" "}
              permanently within this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-stone-300"
                disabled={busy}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirm} disabled={busy}>
              {busy ? "Deleting…" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* --------------------------- form live/paused -------------------------- */
export type FormCategoryKey =
  | "registration"
  | "volunteer"
  | "partner"
  | "chapter";

export interface FormSettingsData {
  masterLive: boolean;
  registration: boolean;
  volunteer: boolean;
  partner: boolean;
  chapter: boolean;
}

/** Plain on/off switch (no Radix dependency) — track + sliding knob. */
export const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
  label,
  activeColor = "bg-green-600",
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  activeColor?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? activeColor : "bg-stone-300"
    }`}
  >
    <span
      className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

/**
 * Site-wide switch shown in the Form Data tab, below the logout button.
 * Pausing hides every public submission form behind a "we'll start this
 * soon" notice; it overrides (but doesn't change) each form's own toggle.
 */
export const MasterFormsToggle = ({
  live,
  onToggle,
  busy,
}: {
  live: boolean;
  onToggle: () => Promise<void>;
  busy: boolean;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmPause = async () => {
    await onToggle();
    setConfirmOpen(false);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 pt-6">
      <div className="flex items-center gap-2 text-sm text-stone-600">
        <span
          className={`h-2 w-2 rounded-full ${
            live ? "bg-green-500" : "bg-amber-500"
          }`}
        />
        Public forms are currently{" "}
        <span
          className={`font-semibold ${
            live ? "text-green-700" : "text-amber-700"
          }`}
        >
          {live ? "live" : "paused"}
        </span>
      </div>

      <div
        className="flex items-center gap-2.5"
        title={
          live
            ? "Pausing hides every public form and shows a “we’ll start this soon” message instead."
            : "Resume accepting submissions on every public form."
        }
      >
        <span
          className={`text-sm font-medium ${
            live ? "text-stone-500" : "text-amber-700"
          }`}
        >
          Pause All Forms
        </span>
        <ToggleSwitch
          checked={live}
          disabled={busy}
          label={live ? "Pause all forms" : "Live all forms"}
          activeColor="bg-green-600"
          onChange={() => (live ? setConfirmOpen(true) : onToggle())}
        />
        <span
          className={`text-sm font-medium ${
            live ? "text-green-700" : "text-stone-500"
          }`}
        >
          Live All Forms
        </span>
      </div>

      <Dialog open={confirmOpen} onOpenChange={(v) => !busy && setConfirmOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>Pause all public forms?</DialogTitle>
            <DialogDescription>
              This will disable every public form on the site — visitors
              won’t be able to submit anything. They’ll see a message that
              we’ll start this soon, until you switch this back to live.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-stone-300"
                disabled={busy}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-amber-600 text-white hover:bg-amber-700"
              onClick={handleConfirmPause}
              disabled={busy}
            >
              {busy ? "Pausing…" : "Pause All Forms"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * Per-category toggle rendered inside each Form Data section. Disabled
 * (shown as "Paused (all)") while the master switch above is paused, since
 * the master switch overrides individual state without altering it.
 */
export const FormLiveToggle = ({
  label,
  live,
  masterLive,
  busy,
  onToggle,
}: {
  label: string;
  live: boolean;
  masterLive: boolean;
  busy: boolean;
  onToggle: () => Promise<void>;
}) => {
  const effectiveLive = masterLive && live;
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm shadow-sm"
      title={
        !masterLive
          ? "All forms are currently paused site-wide — switch that back to live to control this one individually."
          : live
          ? "Pause this form — visitors will see a “we’ll start this soon” message."
          : "Resume accepting submissions for this form."
      }
    >
      <span className="text-stone-600">{label}</span>
      <ToggleSwitch
        checked={live}
        disabled={busy || !masterLive}
        label={live ? `Pause ${label}` : `Resume ${label}`}
        onChange={onToggle}
      />
      <span
        className={`text-xs font-semibold ${
          !masterLive
            ? "text-stone-400"
            : effectiveLive
            ? "text-green-700"
            : "text-amber-700"
        }`}
      >
        {!masterLive ? "Paused (all)" : live ? "Live" : "Paused"}
      </span>
    </div>
  );
};
