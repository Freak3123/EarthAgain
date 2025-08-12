"use client";

import { Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const events = [
  {
    title: "Climate Panchayat - Bhubaneswar",
    date: "August 15, 2024",
    time: "10:00 AM",
    location: "Kalinga Stadium",
    image: "/events/climate-panchayat.jpg",
    description:
      "A community-led event discussing grassroots climate action in Odisha.",
  },
  {
    title: "Youth Climate Summit",
    date: "August 22, 2024",
    time: "9:00 AM",
    location: "KIIT University",
    image: "/events/youth-summit.jpg",
    description:
      "Empowering the next generation of leaders to act on climate change.",
  },
  {
    title: "Tree Plantation Drive",
    date: "September 5, 2024",
    time: "6:00 AM",
    location: "Nandankanan",
    image: "/events/tree-drive.jpg",
    description:
      "Join us in planting 10,000+ trees to restore local forest cover.",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="bg-[#fefaf2] text-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Explore Events</h2>
          <Link href="/events">
            <Button variant={"default"} className="bg-transparent shadow-none border-0 text-[#A22D10] hover:text-amber-950 hover:bg-transparent">
              View All Events<ArrowRight className="h-5 w-5"/>
            </Button>
          </Link>
        </div>

        <div
          className={`grid gap-6 ${
            events.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {events.map((event, index) => (
            <Card
              key={index}
              className="bg-white text-black rounded-lg overflow-hidden flex flex-col pb-2 mb-2 p-0 border-0 group shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1712685912274-2483dade540f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 backdrop-blur-md bg-black/50 text-white text-sm px-3 py-1 rounded shadow">
                  {event.location}
                </div>
              </div>

              {/* Event Info */}
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
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
                {/* <Button
                  variant="default"
                  className="mt-4 mb-6 p-5 w-full bg-green-600 hover:bg-green-700 text-md"
                >
                  Register Now
                </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
