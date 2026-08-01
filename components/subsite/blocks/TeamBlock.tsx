import Image from "next/image";
import type { TeamData, TeamMember } from "@/lib/blocks/types";
import { SectionHead, TONES, asArray } from "../shared";

export default function TeamBlock({ data }: { data: TeamData }) {
  const members = asArray<TeamMember>(data.members);
  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8"
    >
      <SectionHead
        id="team-title"
        kicker={data.kicker}
        title={data.title}
        viewAll={data.viewAllLabel}
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((m, i) => {
          const initials = (m.name || "")
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <div key={i}>
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
                {m.imageUrl ? (
                  <Image
                    src={m.imageUrl}
                    alt={m.name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
                      TONES[i % TONES.length]
                    }`}
                  >
                    <span className="text-3xl font-semibold text-white">
                      {initials || "—"}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {m.name}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">{m.role}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
