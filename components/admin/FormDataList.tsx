"use client";
import { useState } from "react";
import axios from "axios";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatCard,
  SectionHeading,
  SearchBar,
  EmptyState,
  ListLoading,
  csvCell,
  matches,
  PeriodToggle,
  PeriodView,
  DeleteAllOlderButton,
  isOlderThanCutoff,
  CUTOFF_YEAR,
  FormLiveToggle,
} from "./shared";

/* A record persisted by one of the public forms. */
export interface FormRecord {
  _id?: string;
  createdAt?: string | Date;
  [key: string]: unknown;
}

export interface Column<T> {
  header: string;
  /** How the value renders in the table cell. */
  cell: (item: T) => React.ReactNode;
  /** Plain-text value for the CSV export. */
  csv: (item: T) => string;
}

/**
 * Generic list view for public-form submissions (volunteers, partners,
 * chapters, hosts). Handles search, overview count, CSV export and per-row
 * delete — callers only describe the data-specific columns.
 */
export function FormDataList<T extends FormRecord>({
  title,
  statLabel,
  statIcon,
  items,
  loading,
  search,
  onSearch,
  onRefresh,
  columns,
  searchFields,
  getLabel,
  deleteEndpoint,
  csvName,
  renderRowActions,
  liveToggle,
}: {
  title: string;
  statLabel: string;
  statIcon: React.ElementType;
  items: T[];
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
  columns: Column<T>[];
  searchFields: (item: T) => (string | undefined | null)[];
  getLabel: (item: T) => string;
  deleteEndpoint: string;
  csvName: string;
  /** Extra per-row controls rendered in the Action cell, before Delete. */
  renderRowActions?: (item: T) => React.ReactNode;
  /** Live/paused toggle for this category's public submission form. */
  liveToggle?: {
    label: string;
    live: boolean;
    masterLive: boolean;
    busy: boolean;
    onToggle: () => Promise<void>;
  };
}) {
  const [view, setView] = useState<PeriodView>("new");

  const safe = Array.isArray(items) ? items : [];
  const newItems = safe.filter((item) => !isOlderThanCutoff(item.createdAt));
  const olderItems = safe.filter((item) => isOlderThanCutoff(item.createdAt));
  const base = view === "older" ? olderItems : newItems;
  const q = search.trim().toLowerCase();
  const visible = base.filter((item) => matches(q, searchFields(item)));

  const handleDeleteAllOlder = async () => {
    await axios.post(deleteEndpoint, {});
    await onRefresh();
    setView("new");
  };

  const submittedOn = (item: T) =>
    item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const exportCsv = () => {
    const header = [...columns.map((c) => c.header), "Submitted On"];
    const rows: string[][] = [header];
    safe.forEach((item) => {
      rows.push([...columns.map((c) => c.csv(item)), submittedOn(item)]);
    });
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (item: T) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the submission from "${getLabel(item)}"?`
      )
    )
      return;
    try {
      await axios.delete(deleteEndpoint, { data: { id: item._id } });
      await onRefresh();
    } catch {
      alert("Failed to delete submission.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading title={title} count={safe.length} />
        <div className="flex flex-wrap items-center gap-3">
          {liveToggle && <FormLiveToggle {...liveToggle} />}
          <Button
            variant="outline"
            className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
            onClick={exportCsv}
            disabled={safe.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={statIcon} label={statLabel} value={safe.length} />
      </div>

      {/* Older / new toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodToggle
          view={view}
          onView={setView}
          newCount={newItems.length}
          olderCount={olderItems.length}
        />
        {view === "older" && olderItems.length > 0 && (
          <DeleteAllOlderButton onDeleteAll={handleDeleteAllOlder} />
        )}
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={onSearch}
        placeholder="Search by name, email, or phone…"
      />

      {/* Table */}
      {loading ? (
        <ListLoading />
      ) : safe.length === 0 ? (
        <EmptyState message={`No ${title.toLowerCase()} found.`} />
      ) : base.length === 0 ? (
        <EmptyState
          message={
            view === "older"
              ? `No ${title.toLowerCase()} submitted before ${CUTOFF_YEAR}.`
              : `No ${title.toLowerCase()} submitted from ${CUTOFF_YEAR} onward.`
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState message={`No ${title.toLowerCase()} match “${search}”.`} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-stone-50/60 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  {columns.map((c) => (
                    <th key={c.header} className="px-4 py-3 font-medium">
                      {c.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {visible.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="transition hover:bg-stone-50/60"
                  >
                    {columns.map((c, ci) => (
                      <td
                        key={c.header}
                        className={`px-4 py-3 align-top ${
                          ci === 0
                            ? "font-medium text-stone-900"
                            : "text-stone-600"
                        }`}
                      >
                        {c.cell(item)}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-top font-mono text-xs text-stone-500">
                      {submittedOn(item)}
                    </td>
                    <td className="px-5 py-3 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        {renderRowActions?.(item)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-stone-400 hover:bg-red-50 hover:text-red-600"
                          title={`Delete submission from ${getLabel(item)}`}
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
