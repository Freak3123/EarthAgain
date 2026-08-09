"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Trash2, Loader2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionHeading,
  EmptyState,
  ListLoading,
  listCard,
  label,
  input,
} from "../shared";

type RegDate = { _id: string; date: string; note?: string };

/**
 * Standalone registration days — the ones people can register for without a
 * session existing on them yet. The register form merges these with the days
 * derived from reg events.
 */
export function RegDatesPanel() {
  const [dates, setDates] = useState<RegDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await axios.get("/api/get-regDates");
      setDates(res.data);
    } catch {
      // The list simply stays empty if this fails.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!date) return;
    setSaving(true);
    try {
      await axios.post("/api/admin/save-regDate", { date, note });
      setDate("");
      setNote("");
      await load();
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to add the date.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, shown: string) => {
    if (!window.confirm(`Remove ${shown} from the registration days?`)) return;
    try {
      await axios.delete("/api/admin/delete-regDate", { data: { id } });
      await load();
    } catch {
      alert("Failed to delete the date.");
    }
  };

  const shownDate = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="mb-8 rounded-xl border border-stone-200/80 bg-white p-5 shadow-sm">
        <span className={label}>Add a registration day</span>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={date}
            disabled={saving}
            onChange={(e) => setDate(e.target.value)}
            className={`${input} w-auto`}
          />
          <input
            type="text"
            value={note}
            disabled={saving}
            placeholder="Label (optional) — e.g. Day 1"
            onChange={(e) => setNote(e.target.value)}
            className={`${input} w-auto min-w-56`}
          />
          <Button
            className="gap-1.5 bg-[#79b727] hover:bg-[#338c20]"
            disabled={saving || !date}
            onClick={handleAdd}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
            Add Date
          </Button>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Days added here appear on the registration form even when no session
          has been scheduled on them yet.
        </p>
      </div>

      <SectionHeading title="Registration Days" count={dates.length} />

      {loading ? (
        <ListLoading />
      ) : dates.length === 0 ? (
        <EmptyState message="No standalone days added. The form still offers any day that has a reg event on it." />
      ) : (
        <div className="space-y-4">
          {dates.map((d) => (
            <div key={d._id} className={listCard}>
              <div className="flex-1">
                <div className="text-lg font-bold text-stone-900">
                  {shownDate(d.date)}
                </div>
                {d.note && (
                  <div className="mt-1 text-sm text-stone-600">{d.note}</div>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 self-start md:self-center"
                onClick={() => handleDelete(d._id, shownDate(d.date))}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
