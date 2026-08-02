"use client";

import React from "react";
import { SpeakerMarquee } from "../ui/speaker-marquee";
import { allSpeakers } from "@/lib/speakers";

// Two rows, each a different slice of the roster — nobody appears twice on
// screen, and the opposed directions keep them from reading as one block.
const perRow = Math.ceil(allSpeakers.length / 2);
const rows = [0, 1].map((i) => ({
  speakers: allSpeakers.slice(i * perRow, (i + 1) * perRow),
  startIndex: i * perRow,
}));

// Seconds per tile rather than a fixed duration, so drift speed stays constant
// however long the roster grows. The second row runs slightly quicker.
const SECONDS_PER_TILE = 8;

export default function Testimonials() {
  return (
    <div className="bg-[#0F140F] py-28 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h3 className="text-2xl font-bold text-white/80 sm:mb-2 sm:text-4xl">
          From Fields to Forums
        </h3>
        <h2 className="text-4xl font-bold text-[#79b727] sm:mb-2 sm:text-6xl">
          They Are Leading
        </h2>
        <h3 className="text-4xl font-bold text-white/80 sm:text-6xl">
          A Movement That Matters
        </h3>
      </div>

      <div className="mt-14 space-y-2">
        {rows.map((row, i) => (
          <SpeakerMarquee
            key={i}
            speakers={row.speakers}
            startIndex={row.startIndex}
            direction={i === 1 ? "right" : "left"}
            durationSeconds={
              row.speakers.length * SECONDS_PER_TILE * (i === 1 ? 0.85 : 1)
            }
          />
        ))}
      </div>
    </div>
  );
}

// Youth list — awaiting portraits, then they join the reel above.

// 1. Satyabrat Samal
// 2. ⁠Sweta Padma
// 3. ⁠Kalinga Yuva Sena founder
// 4. ⁠Lipsa - beyond waste
// 5. ⁠Ajit from Ecosathi
// 6. ⁠Ahwan foundation head
// 7. ⁠Prasamit
