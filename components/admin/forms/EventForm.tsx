"use client";
import React, { useState } from "react";
import axios from "axios";
import { CalendarDays, Loader2 } from "lucide-react";
import {
  FormShell,
  label,
  input,
  checkbox,
  fileInput,
  submitBtn,
  IEvent,
} from "../shared";

export const EventForm = () => {
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
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof IEvent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imagePath = formData.image;

      // Upload file only when submitting
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("title", formData.title); // 👈 pass title to API

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();

        if (uploadRes.ok) {
          imagePath = uploadJson.filePath;
        } else {
          alert("Image upload failed!");
          return;
        }
      }
      await axios.post("/api/admin/save-events", {
        ...formData,
        image: imagePath,
      });

      alert("Event created successfully!");

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
        featured: false,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      icon={CalendarDays}
      title="Create Event"
      subtitle="Publish a new event to the public calendar"
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        {/* Title */}
        <div>
          <label className={label}>Event Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className={label}>Event Date</label>
          <input
            type="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={(e) => handleChange("date", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className={label}>Event Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            className={input}
            required
          />
        </div>
        <label className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-stone-50/60 px-3.5 py-2.5">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className={checkbox}
          />
          <span className="text-sm font-medium text-stone-700">
            Mark as Featured
          </span>
        </label>

        {/* Location */}
        <div>
          <label className={label}>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* District */}
        <div>
          <label className={label}>District</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className={label}>Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              handleChange("type", e.target.value as IEvent["type"])
            }
            className={input}
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
          <label className={label}>Attendees</label>
          <input
            type="text"
            value={formData.attendees}
            onChange={(e) => handleChange("attendees", e.target.value)}
            className={input}
            placeholder="e.g., 2000+"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className={label}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={input}
            rows={3}
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className={label}>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className={fileInput}
          />
        </div>

        {selectedFile && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="mt-2 h-48 w-full rounded-lg object-cover"
          />
        )}

        {/* Submit */}
        <button type="submit" disabled={submitting} className={submitBtn}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </FormShell>
  );
};
