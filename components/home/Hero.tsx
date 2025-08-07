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
      <motion.div style={{ y: imageY }} className="w-full h-[85vh] z-0">
        <ImagesSlider className="h-full" images={images} />
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
                Renewing Our Commitment to Sustainability and Conservation
              </h2>
              <br />
              {/*🌱 Raise awareness about mangrove preservation and recreation
              <br />
              🌱 Explore actionable strategies for restoration
              <br />
              🌱 Encourage community participation in protecting these vital
              ecosystems */}
              Join Odisha's largest climate action movement from August 9th to
              October 10th. Together, we'll build a sustainable future through
              community-driven initiatives, workshops, and climate panchayats
              across all constituencies.
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/destinations"
                className=" bg-green-600 hover:bg-green-700 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <Users className="inline mr-2 h-5" />
                Join the Movement
              </Link>
              <Link
                href="/register"
                className=" hover:bg-white/20 border-1 border-green-50 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <CalendarDays className="inline mr-2 h-5" />
                Register for Events
              </Link>
              <Link
                href="/destinations"
                className=" hover:bg-white/20 border-1 border-green-50 w-fit text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                <TreePine className="inline mr-2 h-5" />
                Host Climate Panchayat
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Countdown Timer */}
        <section className="py-8 px-10 bg-green-600">
          <CountdownTimer target="2025-08-31T05:00:00" />
        </section>
      </div>
    </div>
  );
}
