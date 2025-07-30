"use client";

import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Link from "next/link";

export default function Hero() {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <>
      <ImagesSlider className="h-[50rem]" images={images}>
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-10 left-10 z-50 flex flex-col"
        >
          <section>
            <div className="max-w-5xl text-left">
              {/* Tags */}
              {/* <div className="flex flex-wrap gap-3 mb-6">
                {[
                  "Travel Goals",
                  "Vacation",
                  "Explore More",
                  "Nature Trips",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full hover:bg-green-100 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-green-50 mb-4 leading-tight">
                PUNASCHA PRUTHIBI 3.0
                <br />
                <span className="text-green-600">
                  REVIVING MANGROVES,
                  <br />
                  RESHAPING TOMORROW!
                </span>
              </h1>

              {/* Subheadline */}
              <div className="text-lg text-green-50 mb-8 max-w-[45rem]">
                <h2 className="text-xl font-semibold">CAMPAIGN OBJECTIVES :</h2>
                <br />
                🌱 Raise awareness about mangrove preservation and recreation
                <br />
                🌱 Explore actionable strategies for restoration
                <br />
                🌱 Encourage community participation in protecting these vital ecosystems
              </div>

              {/* CTA Button */}
              <Link
                href="/destinations"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-md font-medium transition"
              >
                Join Us
              </Link>
            </div>
          </section>
        </motion.div>
      </ImagesSlider>
    </>
  );
}
