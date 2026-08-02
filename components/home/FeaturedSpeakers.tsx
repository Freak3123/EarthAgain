"use client";
import React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featuredSpeakers = [
  {
    name: "Bhupendra Yadav",
    designation: "Union Cabinet Minister for Environment",
    session: "Union Cabinet Minister for Environment, Forest and Climate Change",
    image:
      "/speaker/Bhupender_Yadav.jpg",
    expertise: "Environment & Climate Policy"
  },
  {
    name: "Jennifer Larsen",
    designation: "US Counsel General in Hyderabad",
    session: "US Counsel General in Hyderabad",
    image:
      "/speaker/Jennifer Larsen.jpg",
    expertise: "Diplomacy & International Relations",
  },
  {
    name: "Sri Naveen Patnaik ",
    designation: "Hon'ble leader of opposition, Odisha",
    session: "Hon'ble leader of opposition, Odisha",
    image:
      "/speaker/Shri-Naveen-Patnaik.jpg",
    expertise: "Disaster Management & Governance",
  },
];

export default function FeaturedSpeakers() {
  return (
    <div className="bg-green-800 text-white">
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured Speakers (keep grid layout) */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Featured Speakers
            </h2>
            <p className="text-xl text-white/80">
              Learn from environmental leaders and experts
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
            {featuredSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="group border-0 pt-0 overflow-hidden shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(15,20,15,0.55)]"
              >
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F140F]/80 via-[#0F140F]/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-sm opacity-90">{speaker.designation}</p>
                    <span className="mt-2 block h-0.5 w-8 bg-[#79b727] transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
                <CardContent className="p-4 py-0">
                  <div className="mb-3">
                    <Badge className="bg-[#EAF6DC] w-[39vw] sm:w-auto text-[#2C5212] font-bold text-xs transition-colors duration-500 group-hover:bg-[#CDE7AC]">
                      <p className="truncate p-1 px-2">{speaker.expertise}</p>
                    </Badge>
                  </div>
                  <p className="text-[#0F140F]/65 font-medium mb-4">
                    {speaker.session}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
