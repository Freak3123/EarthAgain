"use client";
import { useState } from "react";
import axios from "axios";
import {
  UsersRound,
  CalendarDays,
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
} from "./shared";

export function RegistrationsList({
  regList,
  onRefresh,
}: {
  regList: any[];
  onRefresh: () => Promise<void> | void;
}) {
  const [regSearch, setRegSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

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
              const safeRegList = Array.isArray(regList) ? regList : [];

              // Group registrations by date • time • event title
              const grouped = safeRegList.reduce(
                (
                  acc: Record<
                    string,
                    { eventTitle: string; reg: IRegistration }[]
                  >,
                  reg: IRegistration
                ) => {
                  reg.selectedEvents?.forEach((ev) => {
                    const day = new Date(ev.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    const key = `${day} • ${ev.time} • ${ev.title}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push({ eventTitle: ev.title, reg });
                  });
                  return acc;
                },
                {}
              );

              const allKeys = Object.keys(grouped);

              // Overview stats
              const totalRegistrations = safeRegList.length;
              const sessionCount = allKeys.length;
              const uniquePeople = new Set(
                safeRegList
                  .map((r: IRegistration) => r.email?.toLowerCase().trim())
                  .filter(Boolean)
              ).size;

              // Search filtering
              const q = regSearch.trim().toLowerCase();
              const searchActive = q.length > 0;
              const filterEntries = (
                entries: { eventTitle: string; reg: IRegistration }[]
              ) =>
                !searchActive
                  ? entries
                  : entries.filter(({ reg }) =>
                      [reg.name, reg.email, reg.phone]
                        .filter(Boolean)
                        .some((f) => String(f).toLowerCase().includes(q))
                    );

              const visibleGroups = allKeys
                .map((key) => ({ key, entries: filterEntries(grouped[key]) }))
                .filter((g) => g.entries.length > 0);

              const allCollapsed =
                allKeys.length > 0 &&
                allKeys.every((k) => collapsedGroups.has(k));

              return (
                <>
                  {/* Header + export */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <SectionHeading
                      title="Registrations"
                      count={totalRegistrations}
                    />
                    <Button
                      variant="outline"
                      className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
                      onClick={exportRegistrationsCsv}
                      disabled={totalRegistrations === 0}
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
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
                      label="Sessions"
                      value={sessionCount}
                    />
                    <StatCard
                      icon={Users}
                      label="Unique registrants"
                      value={uniquePeople}
                    />
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
                    {allKeys.length > 0 && !searchActive && (
                      <Button
                        variant="outline"
                        className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
                        onClick={() =>
                          setCollapsedGroups(
                            allCollapsed ? new Set() : new Set(allKeys)
                          )
                        }
                      >
                        {allCollapsed ? "Expand all" : "Collapse all"}
                      </Button>
                    )}
                  </div>

                  {/* Groups */}
                  {safeRegList.length === 0 ? (
                    <EmptyState message="No registrations found." />
                  ) : visibleGroups.length === 0 ? (
                    <EmptyState
                      message={`No registrations match “${regSearch}”.`}
                    />
                  ) : (
                    <div className="space-y-4">
                      {visibleGroups.map(({ key, entries }) => {
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
                              onClick={() => !searchActive && toggleGroup(key)}
                              className="flex w-full items-center gap-2.5 px-5 py-4 text-left transition hover:bg-stone-50"
                            >
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${
                                  isCollapsed ? "-rotate-90" : ""
                                }`}
                              />
                              <div className="h-5 w-1 rounded-full bg-green-600" />
                              <span className="font-mono text-sm font-semibold text-stone-800">
                                {key}
                              </span>
                              <span className="ml-auto rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                {entries.length}
                              </span>
                            </button>

                            {!isCollapsed && (
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
                                    {sorted.map(({ reg }, idx) => (
                                      <tr
                                        key={reg._id || idx}
                                        className="transition hover:bg-stone-50/60"
                                      >
                                        <td className="px-5 py-3 font-medium text-stone-900">
                                          {reg.name}
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
                                                    {d}
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
                  )}
                </>
              );
            })()}
          </div>
  );
}
