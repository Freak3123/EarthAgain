"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  // The card grid shows a clamped preview; the full record opens in a dialog.
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
      <section className="pt-32 px-4 md:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Where Change <span className="text-[#79b727]">Happens</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12">
            Workshops, climate panchayats, launches and action drives — real
            gatherings, in real communities, building a greener Odisha one event
            at a time.
          </p>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Featured Event
              </h2>
            </div>

            {events
              .filter((event) => event.featured)
              .map((featuredEvent) => (
                <Card
                  key={featuredEvent._id}
                  className="border-0 rounded-sm p-0 my-2 mb-6 sm:mb-10 shadow-2xl overflow-hidden"
                >
                  <div className="grid lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-48 sm:h-60 lg:h-auto">
                      <Image
                        src={`${featuredEvent.image}`}
                        alt={featuredEvent.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#79b727] text-white">
                          {featuredEvent.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 text-left sm:p-8 lg:p-10 lg:px-12">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                        {featuredEvent.description}
                      </p>

                      <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-8">
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
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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
          <p className="text-lg sm:text-xl text-gray-600 pt-4 sm:pt-6">
            {filteredEvents.length} events found
          </p>
        </div>
      </section>

      {/* All Events */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
            {filteredEvents
              .slice() // a copy to avoid mutating original
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((event) => (
                <Card
                  key={event._id}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  onClick={() => setSelectedEvent(event)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedEvent(event);
                    }
                  }}
                  className="border-0 rounded-sm pt-0 pb-2 sm:pb-6 gap-2 sm:gap-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79b727] focus-visible:ring-offset-2"
                >
                  <div className="relative h-32 sm:h-48 lg:h-60">
                    <Image
                      src={`${event.image}`}
                      alt={event.title}
                      width={400}
                      height={200}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                    {/* Both badges need more width than a phone tile has, so
                        below sm the type and date move under the title. */}
                    <div className="hidden sm:block absolute top-4 left-4">
                      <Badge
                        className={`${
                          event.type === "Launch Event"
                            ? "bg-purple-600"
                            : event.type === "Climate Panchayat"
                            ? "bg-blue-600"
                            : event.type === "Workshop"
                            ? "bg-orange-600"
                            : event.type === "Action Event"
                            ? "bg-[#79b727]"
                            : "bg-gray-600"
                        } text-white`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <div className="hidden sm:block absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {event.date.slice(0, 10)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="px-2 sm:px-6 py-0 pb-0 sm:pb-2 text-left">
                    <h3 className="text-xs leading-tight line-clamp-2 sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-3">
                      {event.title}
                    </h3>
                    <div className="sm:hidden space-y-0.5 text-[11px] leading-tight text-gray-500">
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {event.date.slice(0, 10)}
                        </span>
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                    </div>
                    <p className="hidden sm:block text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="hidden sm:block space-y-2 mb-6">
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

                    {/* <Button className="w-full bg-[#79b727] hover:bg-[#338c20]">
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

          {/* Full detail for whichever card was clicked. */}
          <Dialog
            open={selectedEvent !== null}
            onOpenChange={(open) => !open && setSelectedEvent(null)}
          >
            {/* The close button sits over the photo, so it gets its own chip —
                a bare dark icon disappears on a light image. */}
            <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-lg [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/90 [&_[data-slot=dialog-close]]:p-1.5 [&_[data-slot=dialog-close]]:text-gray-900 [&_[data-slot=dialog-close]]:shadow-md">
              {selectedEvent && (
                <>
                  <div className="relative h-48 w-full sm:h-60">
                    <Image
                      src={`${selectedEvent.image}`}
                      alt={selectedEvent.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 32rem"
                      className="object-cover"
                    />
                    {selectedEvent.type && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-[#79b727] text-white">
                          {selectedEvent.type}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="px-5 pb-6 text-left sm:px-6">
                    <DialogHeader className="text-left">
                      <DialogTitle className="text-xl font-bold text-gray-900 sm:text-2xl">
                        {selectedEvent.title}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Event details
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#79b727]" />
                        <span>{selectedEvent.date.slice(0, 10)}</span>
                      </div>
                      {selectedEvent.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#79b727]" />
                          <span>{selectedEvent.time}</span>
                        </div>
                      )}
                      {selectedEvent.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#79b727]" />
                          <span>
                            {selectedEvent.location}
                            {selectedEvent.district
                              ? `, ${selectedEvent.district}`
                              : ""}
                          </span>
                        </div>
                      )}
                      {selectedEvent.attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#79b727]" />
                          <span>{selectedEvent.attendees} Expected</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-600">
                      {selectedEvent.description}
                    </p>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8 bg-[#79b727] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Want to organize an event in your area? We&apos;ll help you plan and
            execute impactful environmental events in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/join-us" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-[#338c20] hover:bg-gray-100"
              >
                Propose an Event
              </Button>
            </Link>
            <a
              href="mailto:eaoutreach2025@gmail.com"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 bg-transparent"
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
