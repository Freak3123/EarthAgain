import { ArrowRight } from "lucide-react";
import type { AboutData, AboutStat } from "@/lib/blocks/types";
import { Kicker, asArray } from "../shared";

export default function AboutBlock({ data }: { data: AboutData }) {
  const paragraphs = asArray<string>(data.paragraphs);
  const stats = asArray<AboutStat>(data.stats);
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8"
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Kicker>{data.kicker}</Kicker>
          <h2
            id="about-title"
            className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl"
          >
            {data.title}
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-gray-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {data.learnMoreLabel && (
            <a
              href={data.learnMoreHref || "#"}
              className="inline-flex items-center gap-1.5 font-semibold text-[#A22D10] transition-colors hover:text-amber-950"
            >
              {data.learnMoreLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-green-100 pt-12 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold tracking-tight text-gray-900">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
