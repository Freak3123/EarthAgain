"use client";

import type React from "react";

import { useState, useRef } from "react";
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
  Users,
  MessageCircle,
  Calendar,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function ClimatePanchayatPage() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

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
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Leading Change!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your Climate Panchayat proposal has been submitted. Our team will
              contact you within 48 hours with a toolkit and support materials.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Download Organizer Toolkit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-22 bg-[#fefaf2">
      {/* Hero Section */}
      <section className="py-0 px-4 pt-10 bg-[#fefaf2] md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">
              Climate Panchayat Initiative
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Host Your Own{" "}
              <span className="text-green-600">Climate Panchayat</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Bring democracy to climate action. Organize community discussions
              that empower local voices, create awareness, and drive grassroots
              environmental solutions in your constituency.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  What is a Climate Panchayat?
                </h2>
                <p className="text-lg text-gray-600">
                  A Climate Panchayat is a grassroots community forum where
                  local citizens gather to discuss environmental issues, share
                  indigenous knowledge, and develop collective solutions to
                  climate challenges across all 147 constituencies of Odisha.
                  It’s not just a discussion — it’s community-driven democracy
                  in action for a sustainable future, shaped by the voices of
                  those who live closest to the land.
                </p>

                <div className="space-y-4">
                  {[
                    "Community-led environmental discussions",
                    "Local problem identification and solutions",
                    "Collective commitment to climate action",
                    "Democratic participation in environmental decisions",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
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
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How to Organize a Climate Panchayat
            </h2>
            <p className="text-xl text-gray-600">
              Follow these simple steps to bring climate democracy to your
              community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="border-0 shadow-lg hover:shadow-xl transition-shadow relative"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl font-bold text-gray-200 mb-4">
                    {step.step}
                  </div>
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${step.color}`}
                  >
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      {/* <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
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
          className="py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl text-center">
                  Host a Climate Panchayat
                </CardTitle>
                <p className="text-center text-gray-600">
                  Fill out this form to register your interest in hosting a
                  Climate Panchayat
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
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
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Proposal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Lead Climate Democracy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of community leaders across Odisha who are hosting
            Climate Panchayats. Your leadership can spark the change your
            community needs.
          </p>
          {!showForm && (
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
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
