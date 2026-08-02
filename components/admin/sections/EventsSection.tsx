"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventForm } from "../forms/EventForm";
import SiteFilterSelect, { SiteFilterValue, matchesSiteFilter } from "../SiteFilterSelect";
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
  PeriodToggle,
  PeriodView,
  DeleteAllOlderButton,
  isOlderThanCutoff,
  CUTOFF_YEAR,
} from "../shared";

export function EventsSection({
  events,
  loading,
  search,
  onSearch,
  onRefresh,
  formMode = "admin",
  showSiteFilter = true,
  allowBulkDelete = true,
}: {
  events: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
  /** "site" hides the distribution selector in the create form — used inside the sub-site builder. */
  formMode?: "admin" | "site";
  /** Hide the All/Main-Site/sub-site scope filter — pointless when the list is already one site's own. */
  showSiteFilter?: boolean;
  /** Hide the unscoped bulk "delete everything older" action — superadmin-console only. */
  allowBulkDelete?: boolean;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const [view, setView] = useState<PeriodView>("new");
  const [siteFilter, setSiteFilter] = useState<SiteFilterValue>("all");
  const count = Array.isArray(events) ? events.length : 0;

  const handleDeleteAllOlder = async () => {
    await axios.post("/api/admin/delete-events", {});
    await onRefresh();
    setView("new");
  };

  const handleSaved = () => {
    setMode("manage");
    onRefresh();
  };

  const arr = Array.isArray(events) ? events : [];
  const scoped = showSiteFilter ? arr.filter((e: any) => matchesSiteFilter(e, siteFilter)) : arr;
  const newArr = scoped.filter((e: any) => !isOlderThanCutoff(e.date));
  const olderArr = scoped.filter((e: any) => isOlderThanCutoff(e.date));
  const base = view === "older" ? olderArr : newArr;

  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Event"
      />
      {mode === "create" ? (
        <EventForm mode={formMode} onSaved={handleSaved} />
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <PeriodToggle
              view={view}
              onView={setView}
              newCount={newArr.length}
              olderCount={olderArr.length}
            />
            <div className="flex items-center gap-3">
              {showSiteFilter && (
                <SiteFilterSelect value={siteFilter} onChange={setSiteFilter} />
              )}
              {allowBulkDelete && view === "older" && olderArr.length > 0 && (
                <DeleteAllOlderButton onDeleteAll={handleDeleteAllOlder} />
              )}
            </div>
          </div>
          <SectionHeading
            title="All Events"
            count={scoped.length}
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
            if (loading) return <ListLoading />;
            if (arr.length === 0)
              return <EmptyState message="No events found." />;
            if (base.length === 0)
              return (
                <EmptyState
                  message={
                    view === "older"
                      ? `No events before ${CUTOFF_YEAR}.`
                      : `No events from ${CUTOFF_YEAR} onward.`
                  }
                />
              );
            const q = search.trim().toLowerCase();
            const shown = [...base]
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
