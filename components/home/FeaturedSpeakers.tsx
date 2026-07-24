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
    <div className="bg-[#0F140F] text-white">
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured Speakers (keep grid layout) */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                className="border-0 pt-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-60">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-sm opacity-90">{speaker.designation}</p>
                  </div>
                </div>
                <CardContent className="p-4 py-0">
                  <div className="mb-3">
                    <Badge className="bg-green-100 w-[39vw] sm:w-auto text-green-800 font-bold text-xs">
                      <p className="truncate p-1 px-2">{speaker.expertise}</p>
                    </Badge>
                  </div>
                  <p className="text-gray-600 font-medium mb-4">
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
