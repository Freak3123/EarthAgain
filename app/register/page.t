"use client";

import type React from "react";

import { useState } from "react";
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
    registrationDays: [] as string[],
    occupation: "",
    interests: [] as string[],
    // experience: "",
    // availability: "",
    // newsletter: false,
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

                  <div className="space-y-2">
                    <Label htmlFor="registrationDays">
                      Select Registration Days
                    </Label>
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.registrationDays.includes(
                            "6 Oct 2025"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: [
                                  ...prev.registrationDays,
                                  "6 Oct 2025",
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: prev.registrationDays.filter(
                                  (day) => day !== "6 Oct 2025"
                                ),
                              }));
                            }
                          }}
                        />
                        <span>6 Oct 2025</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.registrationDays.includes(
                            "7 Oct 2025"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: [
                                  ...prev.registrationDays,
                                  "7 Oct 2025",
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: prev.registrationDays.filter(
                                  (day) => day !== "7 Oct 2025"
                                ),
                              }));
                            }
                          }}
                        />
                        <span>7 Oct 2025</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.registrationDays.includes(
                            "8 Oct 2025"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: [
                                  ...prev.registrationDays,
                                  "8 Oct 2025",
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                registrationDays: prev.registrationDays.filter(
                                  (day) => day !== "8 Oct 2025"
                                ),
                              }));
                            }
                          }}
                        />
                        <span>8 Oct 2025</span>
                      </label>
                    </div>
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
