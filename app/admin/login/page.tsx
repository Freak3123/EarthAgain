"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export interface IEvent {
  title: string;
  date: Date;
  time: string;
  location: string;
  district: string;
  type: string;
  attendees: string; 
  description: string;
  image: string;
}

  const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
        callbackUrl: "/admin/dashboard"
      });

      if (result && result.error) {
        console.error("Sign-in error:", result.error);
      } else if (result) {
        console.log("Signed in successfully!");
      }}
    

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );

  }

  const EventForm =()=>{
    const [formData, setFormData] = useState<IEvent>({
    title: "",
    date: new Date(),
    time: "",
    location: "",
    district: "",
    type: "Exhibition",
    attendees: "",
    description: "",
    image: "",
  });

   const handleChange = (field: keyof IEvent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? new Date(value) : value,
    }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/events", formData);
      alert("Event created successfully!");
      // Optionally reset form
      setFormData({
        title: "",
        date: new Date(),
        time: "",
        location: "",
        district: "",
        type: "Exhibition",
        attendees: "",
        description: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };


    return (<div className="mt-20">
      <div className="flex justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={formData.date.toISOString().split("T")[0]}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleChange("type", e.target.value as IEvent["type"])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Exhibition">Exhibition</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => handleChange("attendees", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 2000+"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL or Description
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  )
  }

const page = () => {
  const [activeTab, setActiveTab] = useState("events");
  const { data: session, status } = useSession();



  if (!session) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-24  min-h-screen bg-gray-100">
      <div  className="flex justify-center">
        <Button
        className="m-3"
          onClick={() => {
            setActiveTab("events");
          }}
        >
          Event
        </Button>
        <Button
        className="m-3"
          onClick={() => {
            setActiveTab("blog");
          }}
        >
          Blog
        </Button>
        <Button
        className="m-3"
          onClick={()=>{signOut()}}
        >
          Logout
        </Button>
      </div>

      <div>
        {activeTab==='events'?(<EventForm/>):("")}
      </div>
    </div>

  );

};


export default page;
