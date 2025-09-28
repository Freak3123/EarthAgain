"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import axios from "axios";

interface ISpeaker {
  _id: string;
  name: string;
  session: string;
  image: string;
  isFeatured?: boolean;
}

export default function SpeakersSection() {
  const [speakers, setSpeakers] = useState<ISpeaker[]>([]);

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const res = await axios.get("/api/get-speakers");
        setSpeakers(res.data);
      } catch (err) {
        console.error("Failed to fetch speakers", err);
      }
    }
    fetchSpeakers();
  }, []);

  const featuredSpeakers = speakers.filter((s) => s.isFeatured);
  const otherSpeakers = speakers.filter((s) => !s.isFeatured);

  return (
    <div>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured Speakers */}
          {featuredSpeakers.length > 0 && (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Speakers
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Learn from environmental leaders and experts
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
                {featuredSpeakers.map((speaker) => (
                  <Card
                    key={speaker._id}
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
                        {/* <h3 className="text-xl font-bold mb-1">
                          {speaker.name}
                        </h3> */}
                      </div>
                    </div>
                    <CardContent className="p-4 py-0">
                      <p className="text-xl font-bold text-center mb-4">
                      {/* <p className="text-gray-600 font-medium mb-4"> */}
                        {/* {speaker.session} */}
                        {speaker.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Speakers (scrollable grid without "View All") */}
        {otherSpeakers.length > 0 && (
          <div className="my-20 mx-auto max-w-[109rem]">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              All Speakers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
              {otherSpeakers.map((speaker) => (
                <Card
                  key={speaker._id}
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
                    </div>
                  </div>
                  <CardContent className="p-4 py-0">
                    <p className="text-gray-600 font-medium mb-4 whitespace-normal break-words">
                      {speaker.session}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
