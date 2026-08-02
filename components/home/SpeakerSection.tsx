"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import { allSpeakers, type Speaker } from "@/lib/speakers";

// Two rows, so the pinned block fills the screen with cards instead of
// whitespace — and each row is half as wide, halving the pinned scroll.
const half = Math.ceil(allSpeakers.length / 2);
const topRow = allSpeakers.slice(0, half);
const bottomRow = allSpeakers.slice(half);

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Card className="border-0 py-0 gap-0 w-72 shrink-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative w-full h-56 md:h-64">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <h3 className="text-lg font-bold">{speaker.name}</h3>
        </div>
      </div>
      <CardContent className="px-4 h-16 flex items-center">
        <p className="text-sm text-gray-600 font-medium line-clamp-2">
          {speaker.session}
        </p>
      </CardContent>
    </Card>
  );
}

export default function SpeakersSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  // Height of the fixed navbar — the pinned block sits just below it.
  const [navHeight, setNavHeight] = useState(100);
  const [stickyHeight, setStickyHeight] = useState(0);

  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      // The longer row decides the travel, so neither runs out early.
      const widest = Math.max(
        topRowRef.current?.scrollWidth ?? 0,
        bottomRowRef.current?.scrollWidth ?? 0
      );
      setScrollDistance(Math.max(0, widest - window.innerWidth));

      const top = window.innerWidth >= 640 ? 100 : 68;
      setNavHeight(top);
      // Hug the content (heading + both rows) plus the block's own py-6, and
      // never overflow the space below the nav on short viewports.
      const content = contentRef.current?.offsetHeight ?? 0;
      setStickyHeight(
        content
          ? Math.min(window.innerHeight - top, content + 48)
          : window.innerHeight - top
      );
    };
    measure();

    // Card images settle in after mount, so re-measure when the block resizes.
    const observer = new ResizeObserver(measure);
    if (contentRef.current) observer.observe(contentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // The block stays pinned for exactly `scrollDistance` px, and the reel
  // travels 1:1 with the wheel over that stretch.
  useEffect(() => {
    const onScroll = () => {
      if (!targetRef.current) return;
      const travelled = navHeight - targetRef.current.getBoundingClientRect().top;
      x.set(-Math.min(Math.max(travelled, 0), scrollDistance));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDistance, navHeight, x]);

  return (
    <div>
      {/* Tall wrapper gives the vertical scroll room that drives the horizontal reel */}
      <section
        ref={targetRef}
        style={
          stickyHeight
            ? { height: `${stickyHeight + scrollDistance}px` }
            : undefined
        }
        className="relative"
      >
        <div
          style={{ top: `${navHeight}px`, height: `${stickyHeight}px` }}
          className="sticky flex flex-col justify-center overflow-hidden py-6"
        >
          <div ref={contentRef} className="flex flex-col gap-4">
            <div className="mx-auto w-full max-w-[109rem] px-4">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                All Speakers
              </h3>
            </div>

            <motion.div
              ref={topRowRef}
              style={{ x }}
              className="flex gap-4 pl-4"
            >
              {topRow.map((speaker, index) => (
                <SpeakerCard key={index} speaker={speaker} />
              ))}
            </motion.div>

            <motion.div
              ref={bottomRowRef}
              style={{ x }}
              className="flex gap-4 pl-4"
            >
              {bottomRow.map((speaker, index) => (
                <SpeakerCard key={index} speaker={speaker} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
