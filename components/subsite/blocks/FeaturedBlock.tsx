import { Clock, Newspaper } from "lucide-react";
import type { FeaturedData, FeaturedItem } from "@/lib/blocks/types";
import { SectionHead, MediaBox, cardShell, asArray } from "../shared";

export default function FeaturedBlock({ data }: { data: FeaturedData }) {
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
          {items.map((a, i) => (
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
                      <Newspaper className="h-4 w-4" />
                      <span>{a.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{a.meta}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
