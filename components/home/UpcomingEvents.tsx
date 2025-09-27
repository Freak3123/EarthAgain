"use client";

import { Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import axios from "axios";

interface EventProps {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<EventProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    async function fetchLiveEvents() {
      try {
        const res = await axios.get("/api/get-events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveEvents();

    // Track window resize
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update displayed events based on window width
  useEffect(() => {
    if (!events.length) return;

    if (windowWidth < 1024) {
      // small & medium → 2 events
      setDisplayedEvents(events.slice(0, 2));
    } else {
      // large → 3 events
      setDisplayedEvents(events.slice(0, 3));
    }
  }, [events, windowWidth]);

  if (isLoading) return <p className="text-center py-8">Loading events...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;

  return (
    <section className="bg-[#fefaf2] text-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Explore Our Events</h2>
          <Link href="/events">
            <Button
              variant={"default"}
              className="bg-transparent shadow-none border-0 text-[#A22D10] hover:text-amber-950 hover:bg-transparent"
            >
              View All Events <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayedEvents.map((event) => (
            <Card
              key={event._id}
              className="bg-white text-black rounded-lg overflow-hidden flex flex-col pb-2 mb-2 p-0 border-0 group shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={
                    event.image ||
                    "https://plus.unsplash.com/premium_photo-1712685912274-2483dade540f?w=500&auto=format&fit=crop&q=60"
                  }
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 backdrop-blur-md bg-black/50 text-white text-sm px-3 py-1 rounded shadow">
                  {event.location}
                </div>
              </div>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="pb-6">
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
