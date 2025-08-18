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
import { Users, Calendar, MapPin, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    district: "",
    constituency: "",
    occupation: "",
    interests: [] as string[],
    experience: "",
    availability: "",
    newsletter: false,
  });

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

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
      }));
    }
  };

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
            <div className="space-y-4">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Share with Friends
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Join Our WhatsApp Group
              </Button>
            </div>
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
            Join the <span className="text-green-600">Movement</span>
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
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="age">Age Group *</Label>
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
                    <Label htmlFor="district">District *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="constituency">Constituency</Label>
                    <Input
                      id="constituency"
                      value={formData.constituency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          constituency: e.target.value,
                        }))
                      }
                      placeholder="Enter your constituency"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Professional & Interest Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        occupation: e.target.value,
                      }))
                    }
                    placeholder="Student, Professional, Business, etc."
                  />
                </div>

                <div className="space-y-4">
                  <Label>Areas of Interest (Select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Tree Plantation",
                      "Climate Panchayats",
                      "Youth Leadership",
                      "Environmental Education",
                      "Sustainable Agriculture",
                      "Renewable Energy",
                      "Waste Management",
                      "Water Conservation",
                    ].map((interest) => (
                      <div
                        key={interest}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={interest}
                          onCheckedChange={(checked) =>
                            handleInterestChange(interest, checked as boolean)
                          }
                        />
                        <Label htmlFor={interest} className="text-sm">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Previous Environmental Experience
                  </Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    placeholder="Tell us about any previous environmental work or volunteer experience..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, availability: value }))
                    }
                  >
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
                      <SelectItem value="weekends">Weekends only</SelectItem>
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

              {/* Newsletter Subscription */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      newsletter: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to our newsletter for updates and event
                  notifications
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
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
