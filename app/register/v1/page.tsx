"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, CheckCircle } from "lucide-react";
import { IRegEvent } from "@/lib/models/regevent";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [events, setEvents] = useState<IRegEvent[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    district: "",
    registrationDays: [] as string[],
    selectedEvents: [] as string[],
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/get-regEvent");
        const data = await res.json();
        setEvents(data);

        // Extract unique dates
        const uniqueDates = Array.from(
          new Set(
            data.map((ev: IRegEvent) =>
              new Date(ev.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            )
          )
        ) as string[];
        uniqueDates.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        setDates(["all", ...uniqueDates]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again later.");
    }
  };

  // Filter events by selected date
  const filteredEvents = events.filter((ev) => {
    const eventDay = new Date(ev.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return (
      formData.registrationDays.includes("all") ||
      formData.registrationDays.includes(eventDay)
    );
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fefaf2] items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Earth Again!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for joining our movement. You&apos;ll receive a
              confirmation email shortly with next steps and upcoming event
              details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefaf2] pt-36 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">
            Event Registration
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join the <span className="text-green-600">Event</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Register for Earth Again and become part of Odisha&apos;s largest
            sustainability movement. Together, we&apos;ll create lasting
            environmental change.
          </p>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl text-center">
              Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name<span className="text-red-600 inline">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address
                      <span className="text-red-600 inline">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number{" "}
                      <span className="text-red-600 inline">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age Group <span className="text-red-600 inline">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, age: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-18">Under 18</SelectItem>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-50">36-50</SelectItem>
                        <SelectItem value="above-50">Above 50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location Details
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="district">
                      District <span className="text-red-600 inline">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, district: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bhubaneswar">Bhubaneswar</SelectItem>
                        <SelectItem value="cuttack">Cuttack</SelectItem>
                        <SelectItem value="puri">Puri</SelectItem>
                        <SelectItem value="berhampur">Berhampur</SelectItem>
                        <SelectItem value="rourkela">Rourkela</SelectItem>
                        <SelectItem value="sambalpur">Sambalpur</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2 mb-6">
                    <Label className="font-semibold text-gray-900">
                      Select Registration Days
                    </Label>
                    <div className="flex flex-col gap-2">
                      {/* "All" checkbox */}
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.registrationDays.includes("all")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: ["all"],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: [],
                              }));
                            }
                          }}
                        />
                        <span>All</span>
                      </label>

                      {/* Dynamic date checkboxes */}
                      {dates
                        .filter((d) => d !== "all")
                        .map((day) => (
                          <label
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.registrationDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    registrationDays: [
                                      ...prev.registrationDays.filter(
                                        (d) => d !== "all"
                                      ),
                                      day,
                                    ],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    registrationDays:
                                      prev.registrationDays.filter(
                                        (d) => d !== day
                                      ),
                                  }));
                                }
                              }}
                            />
                            <span>{day}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
                {/* Events list for selected days */}
                <div className="space-y-6 mb-6">
                  <Label className="font-semibold text-gray-900">
                    Select Sessions to Attend
                  </Label>

                  {filteredEvents.length > 0 ? (
                    // Group events by date
                    Object.entries(
                      filteredEvents.reduce(
                        (acc: Record<string, IRegEvent[]>, ev) => {
                          const eventDay = new Date(ev.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          );
                          if (!acc[eventDay]) acc[eventDay] = [];
                          acc[eventDay].push(ev);
                          return acc;
                        },
                        {}
                      )
                    ).map(([date, eventsOnDay]) => (
                      <div key={date} className="space-y-3">
                        {/* Date Header */}
                        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          {date}
                        </h3>

                        {/* Events Grid for this date */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {eventsOnDay.map((ev) => {
                            const isChecked = formData.selectedEvents.includes(
                              ev._id! as string
                            );

                            return (
                              <label
                                key={ev._id as string}
                                className={`relative flex flex-col p-5 rounded-xl border transition-all cursor-pointer 
                  ${
                    isChecked
                      ? "border-green-600 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                              >
                                {/* Hidden checkbox */}
                                <input
                                  type="checkbox"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        selectedEvents: [
                                          ...prev.selectedEvents,
                                          String(ev._id),
                                        ],
                                      }));
                                    } else {
                                      setFormData((prev) => ({
                                        ...prev,
                                        selectedEvents:
                                          prev.selectedEvents.filter(
                                            (id) => id !== ev._id
                                          ),
                                      }));
                                    }
                                  }}
                                />

                                {/* Event Title */}
                                <h4 className="font-bold text-lg text-gray-900 mb-2">
                                  {ev.title}
                                </h4>

                                {/* Speakers */}
                                {ev.speakers.length > 0 && (
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm font-medium text-gray-800 mb-1">
                                      <Users className="w-4 h-4 text-gray-500 mr-2" />
                                      Speakers:
                                    </div>
                                    <ul className="pl-6 list-disc text-sm text-gray-700 space-y-1">
                                      {ev.speakers.map((spk, idx) => (
                                        <li key={idx}>{spk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No events available for the selected day(s).
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={formData.selectedEvents.length === 0}
              >
                Join Earth Again Movement
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
