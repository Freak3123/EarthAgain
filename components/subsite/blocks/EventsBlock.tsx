import { Calendar, Clock, MapPin } from "lucide-react";
import type { EventsData, EventItem } from "@/lib/blocks/types";
import { SectionHead, MediaBox, cardShell, asArray } from "../shared";

export default function EventsBlock({ data }: { data: EventsData }) {
  const items = asArray<EventItem>(data.items);
  return (
    <section
      id="events"
      aria-labelledby="events-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8"
    >
      <SectionHead
        id="events-title"
        kicker={data.kicker}
        title={data.title}
        viewAll={data.viewAllLabel}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((ev, i) => (
          <div key={i} className={cardShell}>
            <MediaBox src={ev.imageUrl} alt={ev.title} badge={ev.place} toneIndex={i} />
            <div className="flex flex-1 flex-col justify-between gap-5 p-6 pt-4">
              <div>
                <h3 className="mb-1 text-lg font-semibold">{ev.title}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                  {ev.description}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{ev.date}</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
                <Calendar className="h-4 w-4" />
                RSVP
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
