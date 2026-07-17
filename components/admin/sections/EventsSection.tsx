"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventForm } from "../forms/EventForm";
import {
  SectionHeading,
  SearchBar,
  ListLoading,
  EmptyState,
  SectionToggle,
  SectionMode,
  matches,
  listCard,
  IEvent,
} from "../shared";

export function EventsSection({
  events,
  loading,
  search,
  onSearch,
  onRefresh,
}: {
  events: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const count = Array.isArray(events) ? events.length : 0;
  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Event"
      />
      {mode === "create" ? (
        <EventForm />
      ) : (
        <div>
          <SectionHeading
            title="All Events"
            count={count}
            right={
              count > 0 ? (
                <SearchBar
                  value={search}
                  onChange={onSearch}
                  placeholder="Search events…"
                />
              ) : undefined
            }
          />
          {(() => {
                const arr = Array.isArray(events) ? events : [];
                if (loading) return <ListLoading />;
                if (arr.length === 0)
                  return <EmptyState message="No events found." />;
                const q = search.trim().toLowerCase();
                const shown = [...arr]
                  .filter((e: any) =>
                    matches(q, [e.title, e.location, e.district, e.type])
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.date ?? "").getTime() -
                      new Date(a.date ?? "").getTime()
                  );
                if (shown.length === 0)
                  return (
                    <EmptyState message={`No events match “${search}”.`} />
                  );
                return (
                  <div className="space-y-4">
                    {shown.map(
                      (event: IEvent & { _id?: string }, idx: number) => (
                      <div key={event._id || idx} className={listCard}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-stone-900">
                              {event.title}
                            </div>
                            {event.featured && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="mt-1 font-mono text-xs text-stone-500">
                            {event.date
                              ? new Date(event.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : ""}
                            {" • "}
                            {event.time}
                            {" • "}
                            {event.location}
                            {" • "}
                            {event.district}
                            {" • "}
                            {event.type}
                            {" • "}
                            {event.attendees}
                          </div>
                          <div className="mt-2 text-sm text-stone-700">
                            {event.description}
                          </div>
                        </div>

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
                                await axios.delete("/api/admin/delete-events", {
                                  data: { id: event._id },
                                });

                                await onRefresh();
                              } catch (err) {
                                alert("Failed to delete event.");
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
