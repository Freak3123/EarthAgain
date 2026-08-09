"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  MessageCircle,
  Calendar,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import LoaderComp from "@/components/LoaderComp";
import { FormGate } from "@/components/FormGate";
import axios from "axios";

interface IClimatePanchayat {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  attendees: string;
  description: string;
  image: string;
  featured: boolean;
}

export default function ClimatePanchayatPage() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<IClimatePanchayat[]>([]);
  // The card grid shows a clamped preview; the full record opens in a dialog.
  const [selectedEvent, setSelectedEvent] = useState<IClimatePanchayat | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      organizerName: formData.get("organizer-name"),
      organizerEmail: formData.get("organizer-email"),
      organizerPhone: formData.get("organizer-phone"),
      constituency: formData.get("constituency"),
      location: formData.get("location"),
      expectedAttendees: formData.get("expected-attendees") || null,
      preferredDate: formData.get("preferred-date") || null,
      localIssues: formData.get("local-issues") || "",
      experience: formData.get("experience") || "",
      supportNeeded: formData.get("support-needed") || "",
    };

    try {
      const res = await fetch("/api/panchayat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fefaf2] flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Thank You for Leading Change!
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-8">
              Your Climate Panchayat proposal has been submitted. Our team will
              contact you within 48 hours with a toolkit and support materials.
            </p>
            <Button className="w-full bg-[#79b727] hover:bg-[#338c20]">
              Download Organizer Toolkit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    async function fetchClimatePanchayats() {
      try {
        const res = await axios.get("/api/get-climatePanchayat");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch Climate Panchayat events:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClimatePanchayats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderComp />
      </div>
    );
  }

  // Cap the featured band at the three most recent — past that it just repeats
  // what the "All Climate Panchayats" grid below already shows. A no-op while
  // three or fewer are flagged.
  const featuredEvents = events
    .filter((event) => event.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const allEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen pt-22 bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="py-0 px-4 pt-10 bg-[#fefaf2] md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            {/* <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">
              Climate Panchayat Initiative
            </Badge> */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Host Your Own{" "}
              <span className="text-green-600">Climate Panchayat</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">
              Bring democracy to climate action. Organize community discussions
              that empower local voices, create awareness, and drive grassroots
              environmental solutions in your constituency.
            </p>

            {/* Below lg the two-column layout stacks, pushing the main CTA
                under the whole explainer — a long scroll from the top. This
                one carries it up beside the headline. */}
            <Button
              size="lg"
              className="lg:hidden mt-8 w-full sm:w-auto bg-[#79b727] hover:bg-[#338c20]"
              onClick={handleShowForm}
            >
              <Users className="w-5 h-5 mr-2" />
              Host a Climate Panchayat
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  What is a Climate Panchayat?
                </h2>
                <p className="text-base sm:text-lg text-gray-600">
                  A Climate Panchayat is a grassroots community forum where
                  local citizens gather to discuss environmental issues, share
                  indigenous knowledge, and develop collective solutions to
                  climate challenges across all 147 constituencies of Odisha.
                  It’s not just a discussion — it’s community-driven democracy
                  in action for a sustainable future, shaped by the voices of
                  those who live closest to the land.
                </p>
                <p className="text-base sm:text-lg text-gray-600">
                  This initiative is part of Earth Again, a Sambad Group effort
                  and a people-led movement that empowers communities to reclaim
                  their role in protecting the planet - reflecting a growing
                  people-led movement to place climate action back into the
                  hands of communities.
                </p>

                <div className="space-y-2">
                  {[
                    "Community-led environmental discussions",
                    "Local problem identification and solutions",
                    "Collective commitment to climate action",
                    "Democratic participation in environmental decisions",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#79b727] rounded-full"></div>
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="hidden lg:inline-flex bg-[#79b727] hover:bg-[#338c20]"
                onClick={handleShowForm}
              >
                <Users className="w-5 h-5 mr-2" />
                Host a Climate Panchayat
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/climate-panchayat.jpg"
                alt="Climate Panchayat - Community Discussion"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 800px"
                className="w-full rounded-2xl h-64 sm:h-80 lg:h-[25rem] shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Organize a Climate Panchayat
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Follow these simple steps to bring climate democracy to your
              community
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-8">
            {[
              {
                step: "01",
                title: "Register Your Interest",
                description:
                  "Fill out our form and tell us about your community and proposed location.",
                icon: MessageCircle,
                color: "bg-green-100 text-green-600",
              },
              {
                step: "02",
                title: "Receive Toolkit",
                description:
                  "Get our comprehensive organizer toolkit with discussion guides and materials.",
                icon: Users,
                color: "bg-blue-100 text-blue-600",
              },
              {
                step: "03",
                title: "Mobilize Community",
                description:
                  "Invite neighbors, local leaders, and youth to participate in the discussion.",
                icon: Calendar,
                color: "bg-orange-100 text-orange-600",
              },
              {
                step: "04",
                title: "Host & Document",
                description:
                  "Conduct the panchayat and share outcomes with the Earth Again network.",
                icon: CheckCircle,
                color: "bg-purple-100 text-purple-600",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="border-0 rounded-sm py-2 sm:py-6 shadow-lg hover:shadow-xl transition-shadow relative"
              >
                <CardContent className="p-3 sm:p-6 lg:p-8 text-center">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-200 mb-1 sm:mb-3">
                    {step.step}
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 ${step.color}`}
                  >
                    <step.icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </div>
                  <h3 className="text-xs leading-tight sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 lg:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[11px] leading-snug sm:text-sm lg:text-base text-gray-600">
                    {step.description}
                  </p>
                </CardContent>
                {/* Only between columns — the right-hand tile of each row ends
                    the row and has nothing to point at. */}
                {(index + 1) % 2 !== 0 && index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
 
      {/*Events */}
      <section className="pt-12 sm:pt-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
      <div className="max-w-7xl mx-auto text-center">
        {/* Featured Climate Panchayat */}
        {featuredEvents.length > 0 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Climate Panchayat
              </h2>
            </div>

            {featuredEvents.map((featuredEvent) => (
              <Card
                key={featuredEvent._id}
                className="border-0 rounded-sm p-0 my-2 mb-10 sm:mb-20 shadow-xl overflow-hidden"
              >
                <div className="grid lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-60 lg:h-auto">
                    <Image
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#79b727] text-white">Featured</Badge>
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

                    <div className="space-y-3 mb-2 sm:mb-8">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span>{featuredEvent.date.slice(0, 10)}</span>
                      </div>
                      {/* <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span>
                          {featuredEvent.time || "Time not specified"}
                        </span>
                      </div> */}
                      {/* <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Users className="w-5 h-5 text-green-600" />
                        <span>{featuredEvent.attendees} Expected</span>
                      </div> */}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* All Climate Panchayats */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Climate Panchayats
          </h2>
        </div>

        {/* No horizontal padding here — the parent section already pads, and
            doubling it squeezed the cards on phones. */}
        <section className="py-4 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
              {allEvents.map((event) => (
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
                      src={event.image}
                      alt={event.title}
                      width={400}
                      height={200}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                      className="w-full h-full object-cover"
                    />
                    {/* The date badge needs more width than a phone tile has,
                        so below sm it moves under the title instead. */}
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

                    {/* <div className="space-y-2 mb-6">
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
                    </div> */}
                  </CardContent>
                </Card>
              ))}
            </div>

            {allEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No events found.
                </p>
              </div>
            )}

            {/* Full detail for whichever card was clicked. */}
            <Dialog
              open={selectedEvent !== null}
              onOpenChange={(open) => !open && setSelectedEvent(null)}
            >
              {/* The close button sits over the photo, so it gets its own
                  chip — a bare dark icon disappears on a light image. */}
              <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-lg [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/90 [&_[data-slot=dialog-close]]:p-1.5 [&_[data-slot=dialog-close]]:text-gray-900 [&_[data-slot=dialog-close]]:shadow-md">
                {selectedEvent && (
                  <>
                    <div className="relative h-48 w-full sm:h-60">
                      <Image
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 32rem"
                        className="object-cover"
                      />
                    </div>

                    <div className="px-5 pb-6 text-left sm:px-6">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-xl font-bold text-gray-900 sm:text-2xl">
                          {selectedEvent.title}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Climate Panchayat event details
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-[#79b727]" />
                        <span>{selectedEvent.date.slice(0, 10)}</span>
                      </div>

                      {selectedEvent.location && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-[#79b727]" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}

                      {selectedEvent.time && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-[#79b727]" />
                          <span>{selectedEvent.time}</span>
                        </div>
                      )}

                      {selectedEvent.attendees && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-[#79b727]" />
                          <span>{selectedEvent.attendees} attended</span>
                        </div>
                      )}

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
      </div>
    </section>

      {/* Benefits */}
      {/* <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Host a Climate Panchayat?</h2>
            <p className="text-xl text-gray-600">The impact goes beyond just one meeting</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Community Empowerment",
                description:
                  "Give your community a voice in environmental decisions and create local ownership of climate solutions.",
                image: "community empowerment meeting in rural Odisha",
              },
              {
                title: "Local Solutions",
                description:
                  "Identify and implement environmental solutions that are specific to your area's unique challenges.",
                image: "local environmental solutions being discussed",
              },
              {
                title: "Network Building",
                description:
                  "Connect with other Climate Panchayats across Odisha and share best practices and resources.",
                image: "network of connected communities across Odisha",
              },
              {
                title: "Youth Engagement",
                description:
                  "Involve young people in meaningful environmental discussions and leadership opportunities.",
                image: "young people leading environmental discussions",
              },
              {
                title: "Policy Influence",
                description:
                  "Contribute to state-level environmental policy through grassroots input and recommendations.",
                image: "policy makers listening to community input",
              },
              {
                title: "Lasting Impact",
                description:
                  "Create ongoing environmental initiatives that continue long after the 60-day movement ends.",
                image: "sustainable environmental projects in communities",
              },
            ].map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&query=${benefit.image}`}
                    alt={benefit.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Registration Form */}
      {showForm && (
        <section
          ref={formRef}
          className="py-12 sm:py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]"
        >
          <div className="max-w-4xl mx-auto">
            <FormGate formKey="panchayat">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl text-center">
                  Host a Climate Panchayat
                </CardTitle>
                <p className="text-sm sm:text-base text-center text-gray-600">
                  Fill out this form to register your interest in hosting a
                  Climate Panchayat
                </p>
              </CardHeader>
              <CardContent className="p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizer-name">Your Name *</Label>
                      <Input
                        id="organizer-name"
                        name="organizer-name"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer-email">Email Address *</Label>
                      <Input
                        id="organizer-email"
                        name="organizer-email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizer-phone">Phone Number *</Label>
                      <Input
                        id="organizer-phone"
                        name="organizer-phone"
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="constituency">Constituency *</Label>
                      <Input
                        id="constituency"
                        name="constituency"
                        placeholder="Enter your constituency"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Proposed Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Where do you plan to host the Climate Panchayat?"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expected-attendees">
                        Expected Attendees
                      </Label>
                      <Select name="expected-attendees">
                        <SelectTrigger>
                          <SelectValue placeholder="How many people do you expect?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10-25">10-25 people</SelectItem>
                          <SelectItem value="25-50">25-50 people</SelectItem>
                          <SelectItem value="50-100">50-100 people</SelectItem>
                          <SelectItem value="100+">100+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred-date">Preferred Date</Label>
                      <Input id="preferred-date" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="local-issues">
                      Local Environmental Issues
                    </Label>
                    <Textarea
                      id="local-issues"
                      name="local-issues"
                      placeholder="What are the main environmental challenges in your area?"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Your Experience</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      placeholder="Tell us about your experience in community organizing or environmental work..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-needed">Support Needed</Label>
                    <Textarea
                      id="support-needed"
                      name="support-needed"
                      placeholder="What kind of support do you need from Earth Again team?"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#79b727] hover:bg-[#338c20]"
                  >
                    Submit Proposal
                  </Button>
                </form>
              </CardContent>
            </Card>
            </FormGate>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 sm:py-20 px-4 md:px-6 lg:px-8 bg-[#79b727] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Lead Climate Democracy?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Join hundreds of community leaders across Odisha who are hosting
            Climate Panchayats. Your leadership can spark the change your
            community needs.
          </p>
          {!showForm && (
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-[#338c20] hover:bg-gray-100"
              onClick={handleShowForm}
            >
              <Users className="w-5 h-5 mr-2" />
              Start Your Climate Panchayat
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
