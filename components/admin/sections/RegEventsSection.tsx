"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegEventForm } from "../forms/RegEventForm";
import {
  SectionHeading,
  SearchBar,
  ListLoading,
  EmptyState,
  SectionToggle,
  SectionMode,
  matches,
  listCard,
  RegEventFormData,
} from "../shared";

export function RegEventsSection({
  regevents,
  loading,
  search,
  onSearch,
  onRefresh,
}: {
  regevents: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const count = Array.isArray(regevents) ? regevents.length : 0;
  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Reg Event"
      />
      {mode === "create" ? (
        <RegEventForm />
      ) : (
        <div>
          <SectionHeading
            title="All Registration Events"
            count={count}
            right={
              count > 0 ? (
                <SearchBar
                  value={search}
                  onChange={onSearch}
                  placeholder="Search registration events…"
                />
              ) : undefined
            }
          />
          {(() => {
                const arr = Array.isArray(regevents) ? regevents : [];
                if (loading) return <ListLoading />;
                if (arr.length === 0)
                  return (
                    <EmptyState message="No registration events found." />
                  );
                const q = search.trim().toLowerCase();
                const shown = [...arr]
                  .filter((e: any) =>
                    matches(q, [
                      e.title,
                      e.description,
                      (e.speakers || []).join(" "),
                    ])
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt ?? "").getTime() -
                      new Date(a.createdAt ?? "").getTime()
                  );
                if (shown.length === 0)
                  return (
                    <EmptyState
                      message={`No registration events match “${search}”.`}
                    />
                  );
                return (
                  <div className="space-y-4">
                    {shown.map(
                      (
                        event: RegEventFormData & { _id?: string },
                        idx: number
                      ) => (
                        <div key={event._id || idx} className={listCard}>
                          {/* Info */}
                          <div className="flex-1">
                            <div className="text-lg font-bold text-stone-900">
                              {event.title}
                            </div>
                            <div className="mt-1 font-mono text-xs text-stone-500">
                              {new Date(event.date).toLocaleDateString()}
                              {event.time && (
                                <span className="ml-2">{event.time}</span>
                              )}
                            </div>
                            <div className="mt-2 text-sm text-stone-700">
                              {event.description}
                            </div>
                            {event.speakers?.length > 0 && (
                              <div className="mt-2 text-sm text-green-700">
                                Speakers: {event.speakers.join(", ")}
                              </div>
                            )}
                          </div>

                          {/* Delete */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5 self-start md:self-center"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${event.title}"?`
                                )
                              ) {
                                try {
                                  await axios.delete(
                                    "/api/admin/delete-regEvent",
                                    {
                                      data: { id: event._id },
                                    }
                                  );

                                  await onRefresh();
                                } catch (err) {
                                  alert("Failed to delete registration event.");
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
  );
}
