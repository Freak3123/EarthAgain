"use client";
import React, { useState } from "react";
import { Leaf, Loader2 } from "lucide-react";
import {
  FormShell,
  label,
  input,
  checkbox,
  fileInput,
  submitBtn,
  ClimatePanchayatFormData,
} from "../shared";

export const ClimatePanchayatForm = () => {
  const [formData, setFormData] = useState<ClimatePanchayatFormData>({
    title: "",
    date: new Date(),
    time: "",
    location: "",
    // organizerName: "",
    // attendees: "",
    description: "",
    image: "",
    featured: false,
  } as ClimatePanchayatFormData);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    field: keyof ClimatePanchayatFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "date" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("date", formData.date.toISOString());
      // payload.append("time", formData.time);
      // payload.append("location", formData.location);
      // payload.append("organizerName", formData.organizerName);
      // payload.append("attendees", formData.attendees);
      payload.append("description", formData.description);
      payload.append("featured", String(formData.featured));

      if (selectedFile) {
        payload.append("image", selectedFile);
      }

      const res = await fetch("/api/admin/save-climatePanchayat", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to create Climate Panchayat");
      }

      alert("Climate Panchayat created successfully!");

      // reset form
      setFormData({
        title: "",
        date: new Date(),
        time: "",
        location: "",
        // organizerName: "",
        // attendees: "",
        description: "",
        image: "",
        featured: false,
      } as ClimatePanchayatFormData);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating Climate Panchayat:", error);
      alert("Something went wrong while creating the Climate Panchayat");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      icon={Leaf}
      title="Create Climate Panchayat"
      subtitle="Add a community climate gathering"
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        {/* Title */}
        <div>
          <label className={label}>Title</label>
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
          <label className={label}>Date</label>
          <input
            type="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={(e) => handleChange("date", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Time */}
        {/* <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div> */}

        {/* Location */}
        {/* <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div> */}

        {/* Organizer */}
        {/* <div>
              <label className="block text-sm font-medium mb-2">
                Organizer Name
              </label>
              <input
                type="text"
                value={formData.organizerName}
                onChange={(e) => handleChange("organizerName", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div> */}

        {/* Attendees */}
        {/* <div>
              <label className="block text-sm font-medium mb-2">
                Attendees
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => handleChange("attendees", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., 2000+"
                required
              />
            </div> */}

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

        {/* Featured */}
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
            "Create Climate Panchayat"
          )}
        </button>
      </form>
    </FormShell>
  );
};
