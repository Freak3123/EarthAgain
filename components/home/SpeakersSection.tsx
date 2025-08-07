"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMediaQuery } from "react-responsive";

const featuredSpeakers = [
  {
    name: "Dr. Vandana Shiva",
    designation: "Environmental Activist & Author",
    session: "Keynote: Seeds of Change",
    image:
      "https://images.unsplash.com/photo-1594234591488-128c2968837a?w=500&auto=format&fit=crop&q=60",
    expertise: "Biodiversity & Sustainable Agriculture",
  },
  {
    name: "Sunita Narain",
    designation: "Director, Centre for Science and Environment",
    session: "Climate Policy & Community Action",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
    expertise: "Environmental Policy & Water Management",
  },
  {
    name: "Dr. A.P.J. Abdul Kalam (Memorial)",
    designation: "Former President of India",
    session: "Vision 2030: Green India",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
    expertise: "Science & Technology for Environment",
  },
];

const allSpeakers = Array.from({ length: 40 }, (_, i) => ({
  name: `Speaker ${i + 1}`,
  designation: "Designation",
  session: `Session Topic ${i + 1}`,
  image:
    "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
  expertise: "Expertise / Event name",
}));

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);
  const isSmall = useMediaQuery({ maxWidth: 639 });
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 });
  const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isExtraLarge = useMediaQuery({ minWidth: 1024 });

  let sliceCount = 5;
  if (isSmall) sliceCount = 4;
  else if (isMedium) sliceCount = 3;
  else if (isLarge) sliceCount = 4;
  else if (isExtraLarge) sliceCount = 5;

  const displayedSpeakers = showAll
    ? allSpeakers
    : allSpeakers.slice(0, sliceCount);

  return (
    <div className="bg-[#0F140F] text-white">
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured Speakers */}
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
                    <p className="truncate p-1 px-2">
                      {speaker.expertise}
                    </p>
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

        {/* All Speakers Expandable */}
        <div className="mt-20 mx-auto max-w-[109rem]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              All Speakers
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-0 text-green-600 hover:text-green-500 hover:bg-transparent bg-transparent"
            >
              {showAll ? "Show Less" : "View All Speakers"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
            {displayedSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="border-0 pt-0 h-auto shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
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
                    <p className="truncate p-1 px-2">
                      {speaker.expertise}
                    </p>
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

