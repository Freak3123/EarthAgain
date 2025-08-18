"use client";

import type React from "react";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Handshake,
  Heart,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function JoinPage() {
  const [activeTab, setActiveTab] = useState("volunteer");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const form = new FormData(e.currentTarget);

    if (activeTab === "volunteer") {
      const res = await fetch("/api/join/volunteer", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("vol-name"),
          email: form.get("vol-email"),
          phone: form.get("vol-phone"),
          age: form.get("vol-age"),
          skills: form.getAll("skills"), // checkboxes
          availability: form.get("vol-availability"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      alert(data.message);
    }

    if (activeTab === "partner") {
      const res = await fetch("/api/join/partner", {
        method: "POST",
        body: JSON.stringify({
          organizationName: form.get("org-name"),
          organizationType: form.get("org-type"),
          description: form.get("org-description"),
          contactName: form.get("contact-name"),
          contactDesignation: form.get("contact-designation"),
          contactEmail: form.get("contact-email"),
          contactPhone: form.get("contact-phone"),
          partnershipTypes: form.getAll("partnershipTypes"), // checkboxes
          proposal: form.get("partnership-proposal"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      alert(data.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fefaf2] flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to the Team!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for joining Earth Again. We&apos;ll contact you within
              24 hours with next steps and onboarding information.
            </p>
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Join WhatsApp Group
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Download Volunteer Handbook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">
            Join the Movement
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Be Part of <span className="text-green-600">Change</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Whether you want to volunteer your time or partner with us as an
            organization, there are many ways to contribute to Odisha&apos;s
            sustainability movement.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Join as Volunteer
                </h3>
                <p className="text-gray-600 mb-6">
                  Contribute your time, skills, and passion to create
                  environmental impact in your community.
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setActiveTab("volunteer")}
                >
                  Become a Volunteer
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Partner with Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Collaborate as an organization to amplify impact and reach
                  more communities across Odisha.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActiveTab("partner")}
                >
                  Become a Partner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="volunteer" className="text-lg py-3">
                <Users className="w-5 h-5 mr-2" />
                Volunteer Registration
              </TabsTrigger>
              <TabsTrigger value="partner" className="text-lg py-3">
                <Handshake className="w-5 h-5 mr-2" />
                Partnership Application
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volunteer">
              <Card className="border-0 shadow-2xl">
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 text-green-600" />
                    Volunteer Registration
                  </CardTitle>
                  <p className="text-center text-gray-600">
                    Join thousands of volunteers making a difference across
                    Odisha
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="vol-name">Full Name *</Label>
                          <Input
                            id="vol-name"
                            name="vol-name"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vol-email">Email Address *</Label>
                          <Input
                            id="vol-email"
                            name="vol-email"
                            type="email"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="vol-phone">Phone Number *</Label>
                          <Input
                            id="vol-phone"
                            name="vol-phone"
                            placeholder="+91 XXXXX XXXXX"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vol-age">Age Group *</Label>
                          <Select name="vol-age">
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

                    {/* Skills and Interests */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Skills & Interests
                      </h3>

                      <div className="space-y-4">
                        <Label>Volunteer Areas (Select all that apply)</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            "Event Organization",
                            "Social Media Management",
                            "Content Creation",
                            "Photography/Videography",
                            "Translation (Odia/Hindi)",
                            "Teaching/Training",
                            "Community Outreach",
                            "Technical Support",
                          ].map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={skill} name="skills" value={skill} />
                              <Label htmlFor={skill} className="text-sm">
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vol-availability">Availability *</Label>
                        <Select name="vol-availability">
                          <SelectTrigger>
                            <SelectValue placeholder="How much time can you commit?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="few-hours-week">
                              A few hours per week
                            </SelectItem>
                            <SelectItem value="few-hours-month">
                              A few hours per month
                            </SelectItem>
                            <SelectItem value="weekends">
                              Weekends only
                            </SelectItem>
                            <SelectItem value="flexible">
                              Flexible schedule
                            </SelectItem>
                            <SelectItem value="full-time">
                              Full-time commitment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Join as Volunteer
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partner">
              <Card className="border-0 shadow-2xl">
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                    <Building className="w-6 h-6 text-blue-600" />
                    Partnership Application
                  </CardTitle>
                  <p className="text-center text-gray-600">
                    Collaborate with us to amplify environmental impact across
                    Odisha
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Organization Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Organization Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="org-name">Organization Name *</Label>
                          <Input
                            id="org-name"
                            name="org-name"
                            placeholder="Enter organization name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-type">Organization Type *</Label>
                          <Select name="org-type">
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ngo">
                                NGO/Non-Profit
                              </SelectItem>
                              <SelectItem value="corporate">
                                Corporate
                              </SelectItem>
                              <SelectItem value="educational">
                                Educational Institution
                              </SelectItem>
                              <SelectItem value="government">
                                Government Agency
                              </SelectItem>
                              <SelectItem value="media">
                                Media Organization
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="org-description">
                          Organization Description *
                        </Label>
                        <Textarea
                          id="org-description"
                          name="org-description"
                          placeholder="Tell us about your organization's mission and activities..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Contact Person *</Label>
                          <Input
                            id="contact-name"
                            name="contact-name"
                            placeholder="Primary contact name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-designation">
                            Designation *
                          </Label>
                          <Input
                            id="contact-designation"
                            name="contact-designation"
                            placeholder="Job title/position"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email Address *</Label>
                          <Input
                            id="contact-email"
                            name="contact-email"
                            type="email"
                            placeholder="contact@organization.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone Number *</Label>
                          <Input
                            id="contact-phone"
                            name="contact-phone"
                            placeholder="+91 XXXXX XXXXX"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Partnership Details
                      </h3>

                      <div className="space-y-4">
                        <Label>Partnership Type (Select all that apply)</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            "Financial Sponsorship",
                            "In-kind Support",
                            "Venue Partnership",
                            "Media Partnership",
                            "Technology Support",
                            "Volunteer Support",
                            "Content Partnership",
                            "Research Collaboration",
                          ].map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            > 
                              <Checkbox id={type} name="partnershipTypes" value={type}/>
                              <Label htmlFor={type} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnership-proposal">
                          Partnership Proposal *
                        </Label>
                        <Textarea
                          id="partnership-proposal"
                          name="partnership-proposal"
                          placeholder="Describe how you'd like to partner with Earth Again and what you can contribute..."
                          rows={6}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Partnership Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      {/* <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Join Earth Again?</h2>
            <p className="text-xl text-gray-600">
              The benefits of being part of Odisha's largest sustainability movement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Make Real Impact",
                description: "Contribute to tangible environmental changes in your community and across Odisha.",
                icon: Heart,
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Skill Development",
                description: "Learn new skills in environmental action, community organizing, and leadership.",
                icon: Users,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Network Building",
                description: "Connect with like-minded individuals and organizations passionate about sustainability.",
                icon: Handshake,
                color: "bg-orange-100 text-orange-600",
              },
              {
                title: "Recognition",
                description: "Get recognized for your contributions through certificates and appreciation events.",
                icon: CheckCircle,
                color: "bg-purple-100 text-purple-600",
              },
              {
                title: "Learning Opportunities",
                description: "Access exclusive workshops, training sessions, and expert-led discussions.",
                icon: Building,
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                title: "Long-term Engagement",
                description: "Be part of the 12-year vision for a sustainable Odisha beyond the 60-day movement.",
                icon: ArrowRight,
                color: "bg-emerald-100 text-emerald-600",
              },
            ].map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${benefit.color}`}
                  >
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Success Stories */}
      {/* <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from volunteers and partners who are making a difference</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Patel",
                role: "Volunteer Coordinator",
                story:
                  "Leading the youth engagement program has been incredibly rewarding. We've mobilized over 500 students across 20 colleges in Bhubaneswar.",
                image: "young woman leading environmental workshop",
                impact: "500+ students mobilized",
              },
              {
                name: "Green Tech Solutions",
                role: "Technology Partner",
                story:
                  "Partnering with Earth Again allowed us to deploy solar solutions in 15 rural schools, impacting over 3,000 students.",
                image: "solar panels being installed at rural school",
                impact: "15 schools, 3,000+ students",
              },
              {
                name: "Rajesh Kumar",
                role: "Community Volunteer",
                story:
                  "Organizing climate panchayats in my village has brought the community together like never before. We've planted 1,000 trees together.",
                image: "village community planting trees together",
                impact: "1,000 trees planted",
              },
            ].map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&query=${story.image}`}
                    alt={story.name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white">{story.impact}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-1">{story.name}</h4>
                  <p className="text-sm text-green-600 mb-4">{story.role}</p>
                  <blockquote className="text-gray-600 italic">"{story.story}"</blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
