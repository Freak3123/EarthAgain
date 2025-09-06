"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Link from "next/link";
import { Users, CalendarDays, TreePine } from "lucide-react";
import { CountdownTimer } from "@/components/home/CountdownTimer";

export default function Hero() {
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
      <motion.div style={{ y: imageY }} className="w-full sm:h-[85vh] h-[110vh] z-0">
        <ImagesSlider className="h-full" images={images}>
          {/* You can put any overlay or content here, or leave it empty if not needed */}
        </ImagesSlider>
      </motion.div>

      {/* ✅ Foreground content scrolls normally */}
      <div className="-mt-[80vh] relative z-10">
        {/* Hero text */}
        <section className="h-[80vh] flex items-end pb-6 px-2 sm:pb-12 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col max-w-5xl text-green-50"
          >
            <h1 className="text-5xl md:text-8xl font-bold mb-4 leading-tight">
              Earth{" "}
              <span className="text-green-600">
                Again
                {/* <br />
                RESHAPING TOMORROW! */}
              </span>
            </h1>

            <div className="text-lg mb-8 max-w-[45rem]">
              <h2 className="text-2xl font-semibold">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/join-us"
                className=" bg-green-600 hover:bg-green-700 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <Users className="inline mr-2 h-5" />
                Join the Movement
              </Link>
              <Link
                href="/citizen-voice"
                className=" hover:bg-white/20 border-1 border-green-50 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <CalendarDays className="inline mr-2 h-5" />
                Vote your Issues
              </Link>
              <Link
                href="/climate-panchayat"
                className=" hover:bg-white/20 border-1 border-green-50 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <TreePine className="inline mr-2 h-5" />
                Host Climate Panchayat
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Countdown Timer */}
        <section className="py-8 sm:px-10 px-2 bg-green-600">
          <CountdownTimer target="2025-10-06T09:00:00" />
        </section>
      </div>
    </div>
  );
}
