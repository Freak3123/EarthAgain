"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Speaker } from "@/lib/speakers";

/**
 * A self-scrolling reel of speaker portraits — no quote, no bio, no body copy.
 * The card carries the name and the role, and nothing else.
 */
export function SpeakerMarquee({
  speakers,
  direction = "left",
  durationSeconds = 90,
  startIndex = 0,
  className,
}: {
  speakers: Speaker[];
  direction?: "left" | "right";
  /** One full pass, in seconds. Higher is slower. */
  durationSeconds?: number;
  /** Keeps the alternating tile offset continuous across stacked rows. */
  startIndex?: number;
  className?: string;
}) {
  if (speakers.length === 0) return null;

  return (
    <div
      className={cn(
        // Feathered edges, so tiles arrive and leave instead of being chopped off.
        "group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className
      )}
    >
      <ul
        style={
          {
            "--marquee-duration": `${durationSeconds}s`,
            animationDirection: direction === "left" ? "normal" : "reverse",
          } as React.CSSProperties
        }
        className={cn(
          "flex w-max animate-marquee py-6 will-change-transform",
          "group-hover/row:[animation-play-state:paused]",
          // Reduced motion: hold the reel still and hand scrolling back to the user.
          "motion-reduce:animate-none motion-reduce:w-full motion-reduce:overflow-x-auto"
        )}
      >
        {[0, 1].map((copy) =>
          speakers.map((speaker, i) => (
            <SpeakerTile
              key={`${copy}-${speaker.name}-${i}`}
              speaker={speaker}
              index={startIndex + i + 1}
              // The second half is purely visual filler for the loop.
              duplicate={copy === 1}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function SpeakerTile({
  speaker,
  index,
  duplicate,
}: {
  speaker: Speaker;
  index: number;
  duplicate: boolean;
}) {
  return (
    <li
      aria-hidden={duplicate || undefined}
      className={cn(
        "group/tile mr-4 w-56 shrink-0 md:w-64",
        // Every other tile drops half a step — the reel weaves rather than marches.
        index % 2 === 0 && "translate-y-6"
      )}
    >
      <figure className="relative aspect-4/5 overflow-hidden rounded-lg bg-[#151B15] shadow-lg transition duration-500 group-hover/tile:shadow-xl">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          sizes="(max-width: 768px) 14rem, 16rem"
          loading="lazy"
          quality={70}
          className="object-cover transition duration-700 group-hover/tile:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F140F]/80 via-[#0F140F]/25 to-transparent" />

        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold">{speaker.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm opacity-90">
            {speaker.designation}
          </p>
          <span className="mt-2 block h-0.5 w-8 bg-[#79b727] transition-all duration-500 group-hover/tile:w-full" />
        </figcaption>
      </figure>
    </li>
  );
}
