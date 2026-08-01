import { ArrowRight } from "lucide-react";
import type { HeroData } from "@/lib/blocks/types";
import { Kicker, primaryBtn, ghostBtn, asArray } from "../shared";

export default function HeroBlock({ data }: { data: HeroData }) {
  const details = asArray<string>(data.details);
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
      <Kicker>{data.kicker}</Kicker>
      <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.02em] text-gray-900">
        {data.headline}
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-gray-600">
        {data.subtext}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        {data.primaryLabel && (
          <a href={data.primaryHref || "#"} className={primaryBtn}>
            {data.primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
        {data.secondaryLabel && (
          <a href={data.secondaryHref || "#"} className={ghostBtn}>
            {data.secondaryLabel}
          </a>
        )}
      </div>

      {details.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
          {details.map((d, i) => (
            <span key={i} className="flex items-center gap-x-6">
              {i > 0 && <span aria-hidden="true">·</span>}
              <span>{d}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
