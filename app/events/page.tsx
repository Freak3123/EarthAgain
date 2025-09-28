"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, Users, Search } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import LoaderComp from "@/components/LoaderComp";
import Link from "next/link";

type Event = {
  _id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  district?: string;
  type: string;
  attendees?: string;
  description: string;
  image?: string;
  featured?: boolean;
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveEvents() {
      const res = await axios.get("/api/get-events");
      setEvents(res.data);
      setIsLoading(false);
    }
    fetchLiveEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderComp />
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    const lowerSearch = searchTerm.toLowerCase();

    return (
      event.title.toLowerCase().includes(lowerSearch) ||
      event.description.toLowerCase().includes(lowerSearch) ||
      event.location?.toLowerCase().includes(lowerSearch) ||
      event.district?.toLowerCase().includes(lowerSearch) ||
      event.date?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="min-h-screen bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="pt-30 px-4 md:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Event
              </h2>
            </div>

            {events
              .filter((event) => event.featured)
              .map((featuredEvent) => (
                <Card
                  key={featuredEvent._id}
                  className="border-0 p-0 my-2 mb-10 shadow-2xl overflow-hidden"
                >
                  <div className="grid lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-60 lg:h-auto">
                      <Image
                        src={`${featuredEvent.image}`}
                        alt={featuredEvent.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 text-white">
                          {featuredEvent.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-8 lg:p-10 lg:px-12">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">
                        {featuredEvent.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span>{featuredEvent.date.slice(0, 10)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span>
                            {featuredEvent.time
                              ? featuredEvent.time
                              : "Time not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <span>{featuredEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users className="w-5 h-5 text-green-600" />
                          <span>{featuredEvent.attendees} Expected</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              All Events
            </h2>
          </div>
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto px-4 lg:px-0">
            {/* Search Input */}
            <div className="relative bg-white">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-5 border-green-600 placeholder:text-base placeholder:text-gray-400 w-full"
              />
            </div>
          </div>
          <p className="text-xl text-gray-600 pt-6">
            {filteredEvents.length} events found
          </p>
        </div>
      </section>

      {/* All Events */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents
              .slice() // a copy to avoid mutating original
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((event) => (
                <Card
                  key={event._id}
                  className="border-0 pt-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="relative h-60">
                    <Image
                      src={`${event.image}`}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${
                          event.type === "Launch Event"
                            ? "bg-purple-600"
                            : event.type === "Climate Panchayat"
                            ? "bg-blue-600"
                            : event.type === "Workshop"
                            ? "bg-orange-600"
                            : event.type === "Action Event"
                            ? "bg-green-600"
                            : "bg-gray-600"
                        } text-white`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {event.date.slice(0, 10)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="px-6 py-0 pb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date.slice(0, 10)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} Expected</span>
                      </div>
                    </div>

                    {/* <Button className="w-full bg-green-600 hover:bg-green-700">
                    Register Now
                  </Button> */}
                  </CardContent>
                </Card>
              ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No events found matching your criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Want to organize an event in your area? We&apos;ll help you plan and
            execute impactful environmental events in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join-us">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                Propose an Event
              </Button>
            </Link>
            <a href="mailto:eaoutreach2025@gmail.com">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                Contact Event Team
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
