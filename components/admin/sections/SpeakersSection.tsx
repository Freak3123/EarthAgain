"use client";
import { useState } from "react";
import axios from "axios";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakerForm } from "../forms/SpeakerForm";
import {
  SectionHeading,
  SearchBar,
  ListLoading,
  EmptyState,
  SectionToggle,
  SectionMode,
  matches,
  listCard,
  ISpeaker,
  PeriodToggle,
  PeriodView,
  DeleteAllOlderButton,
  isOlderThanCutoff,
  CUTOFF_YEAR,
} from "../shared";

export function SpeakersSection({
  speakers,
  loading,
  search,
  onSearch,
  onRefresh,
}: {
  speakers: unknown;
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [mode, setMode] = useState<SectionMode>("manage");
  const [view, setView] = useState<PeriodView>("new");
  const count = Array.isArray(speakers) ? speakers.length : 0;

  const handleDeleteAllOlder = async () => {
    await axios.post("/api/admin/delete-speakers", {});
    await onRefresh();
    setView("new");
  };

  return (
    <div>
      <SectionToggle
        mode={mode}
        onMode={setMode}
        count={count}
        createLabel="Add Speaker"
      />
      {mode === "create" ? (
        <SpeakerForm />
      ) : (
        <div>
          {(() => {
            const arr = Array.isArray(speakers) ? speakers : [];
            const newArr = arr.filter((e: any) => !isOlderThanCutoff(e.createdAt));
            const olderArr = arr.filter((e: any) => isOlderThanCutoff(e.createdAt));
            return (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <PeriodToggle
                  view={view}
                  onView={setView}
                  newCount={newArr.length}
                  olderCount={olderArr.length}
                />
                {view === "older" && olderArr.length > 0 && (
                  <DeleteAllOlderButton onDeleteAll={handleDeleteAllOlder} />
                )}
              </div>
            );
          })()}
          <SectionHeading
            title="All Speakers"
            count={count}
            right={
              count > 0 ? (
                <SearchBar
                  value={search}
                  onChange={onSearch}
                  placeholder="Search speakers…"
                />
              ) : undefined
            }
          />
          {(() => {
                const arr = Array.isArray(speakers) ? speakers : [];
                const newArr = arr.filter((e: any) => !isOlderThanCutoff(e.createdAt));
                const olderArr = arr.filter((e: any) => isOlderThanCutoff(e.createdAt));
                const base = view === "older" ? olderArr : newArr;
                if (loading) return <ListLoading />;
                if (arr.length === 0)
                  return <EmptyState message="No speakers found." />;
                if (base.length === 0)
                  return (
                    <EmptyState
                      message={
                        view === "older"
                          ? `No speakers added before ${CUTOFF_YEAR}.`
                          : `No speakers added from ${CUTOFF_YEAR} onward.`
                      }
                    />
                  );
                const q = search.trim().toLowerCase();
                const shown = [...base]
                  .filter((e: any) => matches(q, [e.name, e.session]))
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt ?? "").getTime() -
                      new Date(a.createdAt ?? "").getTime()
                  );
                if (shown.length === 0)
                  return (
                    <EmptyState message={`No speakers match “${search}”.`} />
                  );
                return (
                  <div className="space-y-4">
                    {shown.map(
                      (speaker: ISpeaker & { _id?: string }, idx: number) => (
                        <div key={speaker._id || idx} className={listCard}>
                          <div className="flex flex-1 items-center gap-4">
                            {/* Image */}
                            {speaker.image && (
                              <img
                                src={speaker.image}
                                alt={speaker.name}
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-stone-100"
                              />
                            )}

                            {/* Info */}
                            <div>
                              <div className="text-lg font-bold text-stone-900">
                                {speaker.name}
                              </div>
                              <div className="text-sm text-stone-600">
                                {speaker.session}
                              </div>
                              {speaker.isFeatured && (
                                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  Featured
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Delete */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5 self-start md:self-center"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${speaker.name}"?`
                                )
                              ) {
                                try {
                                  await axios.delete(
                                    "/api/admin/delete-speakers",
                                    {
                                      data: { id: speaker._id },
                                    }
                                  );

                                  await onRefresh();
                                } catch (err) {
                                  alert("Failed to delete speaker.");
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
