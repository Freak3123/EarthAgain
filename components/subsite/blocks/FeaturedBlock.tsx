import { Clock, Newspaper, MapPin, CalendarDays } from "lucide-react";
import type { FeaturedData, FeaturedItem } from "@/lib/blocks/types";
import { SectionHead, MediaBox, cardShell, asArray } from "../shared";

// `items` is injected by the registry from featured Blog posts + Events
// merged together (BlockContext), not authored as part of the block's own
// stored data.
type FeaturedBlockData = FeaturedData & { items: FeaturedItem[] };

export default function FeaturedBlock({ data }: { data: FeaturedBlockData }) {
  const items = asArray<FeaturedItem>(data.items);
  return (
    <section
      id="featured"
      aria-labelledby="featured-title"
      className="scroll-mt-24 border-y border-green-100 bg-white/40"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHead
          id="featured-title"
          kicker={data.kicker}
          title={data.title}
          viewAll={data.viewAllLabel}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => {
            const Line1Icon = a.kind === "event" ? MapPin : Newspaper;
            const Line2Icon = a.kind === "event" ? CalendarDays : Clock;
            return (
              <div key={i} className={cardShell}>
                <MediaBox src={a.imageUrl} alt={a.title} badge={a.badge} toneIndex={i} />
                <div className="flex flex-1 flex-col justify-between p-6 pt-4">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{a.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                      {a.excerpt}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Line1Icon className="h-4 w-4" />
                        <span>{a.line1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Line2Icon className="h-4 w-4" />
                        <span>{a.line2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
