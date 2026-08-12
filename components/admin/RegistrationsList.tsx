"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  UsersRound,
  CalendarDays,
  CalendarRange,
  LayoutList,
  EyeOff,
  Users,
  Search,
  Download,
  ChevronDown,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatCard,
  SectionHeading,
  EmptyState,
  csvCell,
  IRegistration,
  PeriodToggle,
  PeriodView,
  DeleteAllOlderButton,
  isOlderThanCutoff,
  CUTOFF_YEAR,
  FormLiveToggle,
} from "./shared";

/* --------------------------- grouping helpers --------------------------- */

/** How the list is broken into groups: by session, or by day attended. */
type GroupBy = "session" | "date";

/** One registrant inside a group. `allDays` marks a whole-event registrant. */
type GroupEntry = { reg: IRegistration; allDays?: boolean };

/** Bucket for people who ticked "All days" on the form. */
const ALL_DAYS_KEY = "All days";
/** Bucket for rows with neither a registration day nor a session to infer one. */
const NO_DAY_KEY = "No day selected";

const dayLabel = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * `registrationDays` stores the label the form showed (e.g. "6 Oct 2025"),
 * so re-format it to match the session view's day format. Anything that
 * doesn't parse is kept verbatim rather than dropped.
 */
const normaliseDay = (label: string) =>
  Number.isNaN(new Date(label).getTime()) ? label : dayLabel(label);

const dayOrder = (label: string) => {
  const t = new Date(label).getTime();
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
};

/** A day added under Content Management → Registration → Add Dates. */
type RegDate = { date: string; note?: string };

/**
 * Which day bucket(s) a registration falls into. "all" and "none" have no day
 * of their own, so they get placed by submission date instead.
 */
const dayBucketsOf = (reg: IRegistration) => {
  const days = reg.registrationDays ?? [];
  if (days.some((d) => String(d).toLowerCase() === "all"))
    return { kind: "all" as const, keys: [] as string[] };
  const concrete = days.filter(Boolean).map(normaliseDay);
  // Older rows can carry sessions but no stored days — infer the days from
  // the sessions rather than losing the row.
  const inferred = concrete.length
    ? []
    : (reg.selectedEvents ?? []).map((ev) => dayLabel(ev.date));
  const keys = Array.from(new Set([...concrete, ...inferred]));
  return keys.length
    ? { kind: "days" as const, keys }
    : { kind: "none" as const, keys: [] as string[] };
};

/** Session ⇄ date view switch. The session side locks when sessions are hidden. */
const GroupByToggle = ({
  groupBy,
  onGroupBy,
  sessionsDisabled,
}: {
  groupBy: GroupBy;
  onGroupBy: (g: GroupBy) => void;
  sessionsDisabled: boolean;
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40";
  const state = (active: boolean) =>
    active
      ? "bg-[#79b727] text-white shadow-sm"
      : "text-stone-600 hover:bg-stone-100";
  return (
    <div className="inline-flex gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        aria-pressed={groupBy === "date"}
        onClick={() => onGroupBy("date")}
        className={`${base} cursor-pointer ${state(groupBy === "date")}`}
      >
        <CalendarRange className="h-4 w-4" />
        By date
      </button>
      <button
        type="button"
        aria-pressed={groupBy === "session"}
        disabled={sessionsDisabled}
        title={
          sessionsDisabled
            ? "Sessions are hidden from the registration form"
            : undefined
        }
        onClick={() => onGroupBy("session")}
        className={`${base} ${
          sessionsDisabled
            ? "cursor-not-allowed text-stone-400 opacity-60"
            : `cursor-pointer ${state(groupBy === "session")}`
        }`}
      >
        <LayoutList className="h-4 w-4" />
        By session
      </button>
    </div>
  );
};

export function RegistrationsList({
  regList,
  onRefresh,
  liveToggle,
  sessionsHidden = false,
}: {
  regList: any[];
  onRefresh: () => Promise<void> | void;
  liveToggle?: {
    label: string;
    live: boolean;
    masterLive: boolean;
    busy: boolean;
    onToggle: () => Promise<void>;
  };
  /**
   * True when sessions are hidden from the public form and its confirmation
   * email. New registrations then carry no sessions at all, so grouping by
   * session would show a misleading picture — the view locks to by-date.
   */
  sessionsHidden?: boolean;
}) {
  const [regSearch, setRegSearch] = useState("");
  const [view, setView] = useState<PeriodView>("new");
  const [groupBy, setGroupBy] = useState<GroupBy>(
    sessionsHidden ? "date" : "session"
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  // The days an admin configured under Content Management → Registration.
  // They drive the order of the by-date view and appear even with nobody on
  // them yet, so the configured schedule is always visible in full.
  const [regDates, setRegDates] = useState<RegDate[]>([]);

  // Hiding sessions while the session view is open pulls the rug out from
  // under it, so fall back to by-date the moment the setting flips.
  useEffect(() => {
    if (sessionsHidden) setGroupBy("date");
  }, [sessionsHidden]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/get-regDates")
      .then((res) => {
        if (!cancelled) setRegDates(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        // Without them the by-date view still works — it just falls back to
        // ordering purely by the days present in the registrations.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteAllOlder = async () => {
    await axios.post("/api/admin/delete-registration", {});
    await onRefresh();
    setView("new");
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Flatten registrations (one row per registrant × session) and download as CSV.
  const exportRegistrationsCsv = () => {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Age",
      "District",
      "Registered On",
      "Registration Days",
      "Session Date",
      "Session Time",
      "Session",
    ];
    const rows: string[][] = [header];
    (Array.isArray(regList) ? regList : []).forEach((reg: IRegistration) => {
      const registered = reg.createdAt
        ? new Date(reg.createdAt).toLocaleDateString("en-GB")
        : "";
      const days = reg.registrationDays?.join("; ") ?? "";
      const base = [reg.name, reg.email, reg.phone, reg.age, reg.district, registered, days];
      if (reg.selectedEvents?.length) {
        reg.selectedEvents.forEach((ev) => {
          rows.push([
            ...base,
            new Date(ev.date).toLocaleDateString("en-GB"),
            ev.time,
            ev.title,
          ]);
        });
      } else {
        rows.push([...base, "", "", ""]);
      }
    });

    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
          <div className="space-y-6">
            {(() => {
              const allRegList = Array.isArray(regList) ? regList : [];
              const isOlder = view === "older";
              const inPeriod = (value: unknown) =>
                isOlderThanCutoff(value) === isOlder;

              /**
               * Which side(s) of the cutoff a registration shows up on. By
               * session that's its submission date; by date it's the day(s)
               * attended, per the repo's "content's own date, else createdAt"
               * rule. A registration spanning both sides appears in both.
               */
              const sidesOf = (reg: IRegistration) => {
                const bucket =
                  groupBy === "date" ? dayBucketsOf(reg) : { kind: "none" as const, keys: [] };
                if (bucket.kind !== "days") {
                  const older = isOlderThanCutoff(reg.createdAt);
                  return { new: !older, older };
                }
                return {
                  new: bucket.keys.some((k) => !isOlderThanCutoff(k)),
                  older: bucket.keys.some((k) => isOlderThanCutoff(k)),
                };
              };

              const sides = allRegList.map(sidesOf);
              const newCount = sides.filter((s) => s.new).length;
              const olderCount = sides.filter((s) => s.older).length;
              const safeRegList = allRegList.filter(
                (_: IRegistration, i: number) =>
                  isOlder ? sides[i].older : sides[i].new
              );

              const grouped: Record<string, GroupEntry[]> = {};
              // Header text per group — only configured days differ from the key.
              const groupLabels: Record<string, string> = {};
              // Groups in render order, optionally under a heading.
              let sections: { title: string | null; keys: string[] }[] = [];
              let dayCount = 0;

              if (groupBy === "session") {
                // Group by date • time • event title
                safeRegList.forEach((reg: IRegistration) => {
                  reg.selectedEvents?.forEach((ev) => {
                    const key = `${dayLabel(ev.date)} • ${ev.time} • ${ev.title}`;
                    (grouped[key] ??= []).push({ reg });
                  });
                });
                sections = [{ title: null, keys: Object.keys(grouped) }];
              } else {
                // Group by the day(s) each person registered to attend, in the
                // order those days are listed in Content Management.
                const configured = regDates
                  .map((d) => ({ key: dayLabel(d.date), note: d.note, raw: d.date }))
                  .filter((d) => inPeriod(d.raw));

                const allDayRegs: IRegistration[] = [];
                const noDayRegs: IRegistration[] = [];

                allRegList.forEach((reg: IRegistration) => {
                  const bucket = dayBucketsOf(reg);
                  if (bucket.kind === "all") {
                    if (inPeriod(reg.createdAt)) allDayRegs.push(reg);
                    return;
                  }
                  if (bucket.kind === "none") {
                    if (inPeriod(reg.createdAt)) noDayRegs.push(reg);
                    return;
                  }
                  bucket.keys
                    .filter((k) => inPeriod(k))
                    .forEach((k) => (grouped[k] ??= []).push({ reg }));
                });

                // A configured day is listed even with nobody on it yet.
                configured.forEach((c) => {
                  grouped[c.key] ??= [];
                  if (c.note) groupLabels[c.key] = `${c.key} • ${c.note}`;
                });

                const configuredKeys = new Set(configured.map((c) => c.key));
                const looseKeys = Object.keys(grouped)
                  .filter((k) => !configuredKeys.has(k))
                  .sort((a, b) => dayOrder(a) - dayOrder(b));

                // "All days" registrants attend every day, so each day's count
                // reflects the real expected headcount — and they also get
                // their own group so the raw figure stays visible.
                allDayRegs.forEach((reg) =>
                  Object.values(grouped).forEach((entries) =>
                    entries.push({ reg, allDays: true })
                  )
                );
                if (allDayRegs.length)
                  grouped[ALL_DAYS_KEY] = allDayRegs.map((reg) => ({
                    reg,
                    allDays: true,
                  }));
                if (noDayRegs.length)
                  grouped[NO_DAY_KEY] = noDayRegs.map((reg) => ({ reg }));

                dayCount = configured.length + looseKeys.length;
                sections = [
                  { title: null, keys: allDayRegs.length ? [ALL_DAYS_KEY] : [] },
                  {
                    title: "Registration days",
                    keys: configured.map((c) => c.key),
                  },
                  {
                    title: "Not sure",
                    keys: [
                      ...looseKeys,
                      ...(noDayRegs.length ? [NO_DAY_KEY] : []),
                    ],
                  },
                ];
              }

              // Overview stats
              const totalRegistrations = safeRegList.length;
              const groupStat =
                groupBy === "session"
                  ? { label: "Sessions", value: sections[0].keys.length }
                  : { label: "Days", value: dayCount };
              const uniquePeople = new Set(
                safeRegList
                  .map((r: IRegistration) => r.email?.toLowerCase().trim())
                  .filter(Boolean)
              ).size;

              // Search filtering
              const q = regSearch.trim().toLowerCase();
              const searchActive = q.length > 0;
              const filterEntries = (entries: GroupEntry[]) =>
                !searchActive
                  ? entries
                  : entries.filter(({ reg }) =>
                      [reg.name, reg.email, reg.phone]
                        .filter(Boolean)
                        .some((f) => String(f).toLowerCase().includes(q))
                    );

              let visibleSections = sections
                .map((s) => ({
                  title: s.title,
                  groups: s.keys
                    .map((key) => ({
                      key,
                      label: groupLabels[key] ?? key,
                      entries: filterEntries(grouped[key] ?? []),
                    }))
                    // A configured day with nobody on it still shows, but only
                    // while a search isn't narrowing the list.
                    .filter(
                      (g) =>
                        g.entries.length > 0 ||
                        (!searchActive && (grouped[g.key]?.length ?? 0) === 0)
                    ),
                }))
                .filter((s) => s.groups.length > 0);

              // A lone heading labels nothing useful — drop it.
              if (visibleSections.filter((s) => s.title).length < 2)
                visibleSections = visibleSections.map((s) => ({
                  ...s,
                  title: null,
                }));

              const renderedKeys = visibleSections.flatMap((s) =>
                s.groups.map((g) => g.key)
              );
              const allCollapsed =
                renderedKeys.length > 0 &&
                renderedKeys.every((k) => collapsedGroups.has(k));

              return (
                <>
                  {/* Header + export */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <SectionHeading
                      title="Registrations"
                      count={totalRegistrations}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      {liveToggle && <FormLiveToggle {...liveToggle} />}
                      <Button
                        variant="outline"
                        className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
                        onClick={exportRegistrationsCsv}
                        disabled={allRegList.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                      icon={UsersRound}
                      label="Total registrations"
                      value={totalRegistrations}
                    />
                    <StatCard
                      icon={CalendarDays}
                      label={groupStat.label}
                      value={groupStat.value}
                    />
                    <StatCard
                      icon={Users}
                      label="Unique registrants"
                      value={uniquePeople}
                    />
                  </div>

                  {/* Older / new toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <PeriodToggle
                      view={view}
                      onView={setView}
                      newCount={newCount}
                      olderCount={olderCount}
                    />
                    {/* Withheld in the by-date view: the bulk delete removes
                        by submission date, which is not the split shown. */}
                    {groupBy === "session" &&
                      view === "older" &&
                      olderCount > 0 && (
                        <DeleteAllOlderButton
                          onDeleteAll={handleDeleteAllOlder}
                        />
                      )}
                  </div>

                  {/* Session / date grouping */}
                  <div className="space-y-3">
                    <GroupByToggle
                      groupBy={groupBy}
                      onGroupBy={setGroupBy}
                      sessionsDisabled={sessionsHidden}
                    />
                    {sessionsHidden && (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
                        <EyeOff className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Sessions are hidden from the registration form and its
                          confirmation email, so session-wise grouping is
                          unavailable. People register for whole days instead.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={regSearch}
                        onChange={(e) => setRegSearch(e.target.value)}
                        placeholder="Search by name, email, or phone…"
                        className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-10 pr-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
                      />
                      {regSearch && (
                        <button
                          onClick={() => setRegSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
                          aria-label="Clear search"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {renderedKeys.length > 0 && !searchActive && (
                      <Button
                        variant="outline"
                        className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
                        onClick={() =>
                          setCollapsedGroups(
                            allCollapsed ? new Set() : new Set(renderedKeys)
                          )
                        }
                      >
                        {allCollapsed ? "Expand all" : "Collapse all"}
                      </Button>
                    )}
                  </div>

                  {/* Groups */}
                  {allRegList.length === 0 ? (
                    <EmptyState message="No registrations found." />
                  ) : renderedKeys.length === 0 && !searchActive ? (
                    <EmptyState
                      message={
                        view === "older"
                          ? `No registrations before ${CUTOFF_YEAR}.`
                          : `No registrations from ${CUTOFF_YEAR} onward.`
                      }
                    />
                  ) : renderedKeys.length === 0 ? (
                    <EmptyState
                      message={`No registrations match “${regSearch}”.`}
                    />
                  ) : (
                    <div className="space-y-6">
                      {visibleSections.map((section, si) => (
                      <div key={section.title ?? si} className="space-y-4">
                      {section.title && (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                            {section.title}
                          </span>
                          <div className="h-px flex-1 bg-stone-200" />
                        </div>
                      )}
                      {section.groups.map(({ key, label, entries }) => {
                        const isCollapsed =
                          !searchActive && collapsedGroups.has(key);
                        const sorted = [...entries].sort(
                          (a, b) =>
                            new Date(b.reg.createdAt).getTime() -
                            new Date(a.reg.createdAt).getTime()
                        );
                        return (
                          <div
                            key={key}
                            className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm"
                          >
                            <button
                              onClick={() =>
                                !searchActive &&
                                entries.length > 0 &&
                                toggleGroup(key)
                              }
                              className={`flex w-full items-center gap-2.5 px-5 py-4 text-left transition ${
                                entries.length === 0
                                  ? "cursor-default"
                                  : "hover:bg-stone-50"
                              }`}
                            >
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${
                                  isCollapsed || entries.length === 0
                                    ? "-rotate-90"
                                    : ""
                                }`}
                              />
                              <div
                                className={`h-5 w-1 rounded-full ${
                                  entries.length === 0
                                    ? "bg-stone-300"
                                    : "bg-[#79b727]"
                                }`}
                              />
                              <span
                                className={`font-mono text-sm font-semibold ${
                                  entries.length === 0
                                    ? "text-stone-500"
                                    : "text-stone-800"
                                }`}
                              >
                                {label}
                              </span>
                              <span
                                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                                  entries.length === 0
                                    ? "bg-stone-100 text-stone-500"
                                    : "bg-green-50 text-green-700"
                                }`}
                              >
                                {entries.length}
                              </span>
                            </button>

                            {!isCollapsed && entries.length > 0 && (
                              <div className="overflow-x-auto border-t border-stone-100">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                  <thead className="bg-stone-50/60 text-xs uppercase tracking-wide text-stone-500">
                                    <tr>
                                      <th className="px-5 py-3 font-medium">
                                        Name
                                      </th>
                                      <th className="px-4 py-3 font-medium">
                                        Contact
                                      </th>
                                      <th className="px-4 py-3 font-medium">
                                        Age
                                      </th>
                                      <th className="px-4 py-3 font-medium">
                                        District
                                      </th>
                                      <th className="px-4 py-3 font-medium">
                                        Registered
                                      </th>
                                      <th className="px-4 py-3 font-medium">
                                        Days
                                      </th>
                                      <th className="px-5 py-3 text-right font-medium">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-stone-100">
                                    {sorted.map(({ reg, allDays }, idx) => (
                                      <tr
                                        key={reg._id || idx}
                                        className="transition hover:bg-stone-50/60"
                                      >
                                        <td className="px-5 py-3 font-medium text-stone-900">
                                          {reg.name}
                                          {/* Explains why this person also
                                              appears under every other day. */}
                                          {allDays && key !== ALL_DAYS_KEY && (
                                            <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 align-middle text-[11px] font-medium text-amber-700">
                                              all days
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="font-mono text-xs text-stone-600">
                                            {reg.email}
                                          </div>
                                          <div className="font-mono text-xs text-stone-500">
                                            {reg.phone}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">
                                          {reg.age}
                                        </td>
                                        <td className="px-4 py-3 capitalize text-stone-600">
                                          {reg.district}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-stone-500">
                                          {new Date(
                                            reg.createdAt
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          })}
                                        </td>
                                        <td className="px-4 py-3">
                                          {reg.registrationDays?.length ? (
                                            <div className="flex flex-wrap gap-1">
                                              {reg.registrationDays.map(
                                                (d, i) => (
                                                  <span
                                                    key={i}
                                                    className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                                                  >
                                                    {String(d).toLowerCase() ===
                                                    "all"
                                                      ? "All days"
                                                      : d}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-xs text-stone-400">
                                              —
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-stone-400 hover:bg-red-50 hover:text-red-600"
                                            title={`Delete registration of ${reg.name}`}
                                            onClick={async () => {
                                              if (
                                                window.confirm(
                                                  `Are you sure you want to delete registration of "${reg.name}"?`
                                                )
                                              ) {
                                                try {
                                                  await axios.delete(
                                                    "/api/admin/delete-registration",
                                                    {
                                                      data: { id: reg._id },
                                                    }
                                                  );
                                                  await onRefresh();
                                                } catch (err) {
                                                  alert(
                                                    "Failed to delete registration."
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
  );
}
