import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HighlightData } from "@/lib/blocks/types";
import { Kicker } from "../shared";

export default function HighlightBlock({ data }: { data: HighlightData }) {
  return (
    <section className="border-y border-green-100 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-800">
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.title || ""}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
          )}
          {data.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {data.badge}
            </span>
          )}
        </div>
        <div>
          <Kicker>{data.kicker}</Kicker>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-gray-600">{data.body}</p>
          {(data.author || data.readTime) && (
            <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
              {data.author && (
                <span className="font-medium text-gray-900">By {data.author}</span>
              )}
              {data.author && data.readTime && <span aria-hidden="true">·</span>}
              {data.readTime && <span>{data.readTime}</span>}
            </div>
          )}
          {data.linkLabel && (
            <a
              href={data.linkHref || "#"}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A22D10] transition-colors hover:text-amber-950"
            >
              {data.linkLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
