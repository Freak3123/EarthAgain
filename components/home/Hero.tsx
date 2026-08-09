"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Link from "next/link";
import { Users, CalendarDays, TreePine } from "lucide-react";
import { CountdownTimer } from "@/components/home/CountdownTimer";

// Only used if the page couldn't supply one; the live value is set by a
// superadmin in the console and read from the HomeSettings singleton.
const FALLBACK_COUNTDOWN_TARGET = "2026-10-06T09:00:00+05:30";

// One shared shape for every hero CTA so they read as a set: full width while
// they stack on phones, a fixed width once they sit in a row. Centring the
// icon and label keeps them aligned regardless of how long the text is.
const heroButton =
  "inline-flex w-full sm:w-72 items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

// Dark text on the brand green rather than white: white lands at ~2.5:1 here,
// forest black at ~8:1. Hover therefore *lightens* — darkening would collapse
// the contrast the dark label depends on.
const heroPrimary =
  "bg-[#79b727] text-[#0F140F] shadow-lg shadow-black/25 hover:bg-[#8ecf35]";

// Tinted glass, not a bare outline: the photo slider runs green, so a plain
// border loses its edge against foliage.
const heroSecondary =
  "border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20";

export default function Hero({ countdownTarget }: { countdownTarget?: string }) {
  const scrollRef = useRef(null);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 200]); // scroll range

  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop",
  ];

  return (
    <div ref={scrollRef} className="relative overflow-hidden">
      {/* ✅ Background image with parallax */}
      <motion.div style={{ y: imageY }} className="w-full sm:h-[85vh] h-[125vh] z-0">
        <ImagesSlider className="h-full" images={images}>
          {/* You can put any overlay or content here, or leave it empty if not needed */}
        </ImagesSlider>
      </motion.div>

      {/* ✅ Foreground content scrolls normally */}
      <div className="-mt-[115vh] sm:-mt-[80vh] relative z-10">
        {/* Hero text — a little taller on phones, where the copy plus three
            stacked buttons runs past one screen and would otherwise ride up
            under the fixed navbar. pt-24 keeps a hard floor below it. */}
        <section className="h-[115vh] sm:h-[80vh] flex items-end pt-24 sm:pt-0 pb-6 px-2 sm:pb-12 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col max-w-5xl text-green-50"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-4 leading-tight">
              Earth{" "}
              <span className="text-[#79b727]">
                Again
                {/* <br />
                RESHAPING TOMORROW! */}
              </span>
            </h1>

            <div className="text-base sm:text-lg mb-6 sm:mb-8 max-w-[45rem]">
              <h2 className="text-lg sm:text-2xl font-semibold">
                Earth Again, a flagship initiative by Sambad Group, one of India's leading regional media houses - empowering communities, building future-proof enterprises. 
              </h2>
              <br />
              {/*🌱 Raise awareness about mangrove preservation and recreation
              <br />
              🌱 Explore actionable strategies for restoration
              <br />
              🌱 Encourage community participation in protecting these vital
              ecosystems */}
              Earth Again brings together citizens, entrepreneurs, and innovators to co-create enterprises that are resilient, sustainable, and rooted in local needs. Through community-led workshops, collaborative innovation programs, and Climate Panchayats, we are shaping an Odisha where thriving communities and future-ready businesses grow together in harmony with the planet.
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
              {/* The navbar's Register button is hidden below lg, so the hero
                  carries the CTA on phones and tablets instead. */}
              <Link
                href="/register"
                className={`${heroButton} ${heroPrimary} lg:hidden`}
              >
                <CalendarDays className="h-5 w-5" />
                Register Now
              </Link>
              {/* Secondary on phones/tablets where Register Now leads, and the
                  filled button from lg up, where Register Now is hidden — so
                  exactly one button is filled at every breakpoint. */}
              <Link
                //
                href="/start-chapter"
                className={`${heroButton} ${heroSecondary} lg:border-transparent lg:bg-[#79b727] lg:text-[#0F140F] lg:shadow-lg lg:shadow-black/25 lg:hover:bg-[#8ecf35]`}
              >
                <Users className="h-5 w-5" />
                {/* Join the Movement */}
                Start A Chapter
              </Link>
              <Link
                href="/register"
                className={`${heroButton} ${heroSecondary}`}
              >
                <TreePine className="h-5 w-5" />
                Host Climate Panchayat
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Countdown Timer */}
        <section className="py-8 sm:px-10 px-2 bg-[#a6783f]">
          <CountdownTimer
            target={countdownTarget ?? FALLBACK_COUNTDOWN_TARGET}
          />
        </section>
      </div>
    </div>
  );
}
