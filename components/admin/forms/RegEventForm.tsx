"use client";
import React, { useState } from "react";
import { ClipboardList, Plus, Loader2 } from "lucide-react";
import {
  FormShell,
  label,
  input,
  submitBtn,
  RegEventFormData,
} from "../shared";

export const RegEventForm = () => {
  const [formData, setFormData] = useState<RegEventFormData>({
    title: "",
    date: "",
    time: "",
    description: "",
    speakers: [""], // start with one input field
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof RegEventFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpeakerChange = (index: number, value: string) => {
    const newSpeakers = [...formData.speakers];
    newSpeakers[index] = value;
    setFormData((prev) => ({
      ...prev,
      speakers: newSpeakers,
    }));
  };

  const addSpeakerField = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append("description", formData.description);

      formData.speakers.forEach((speaker) => {
        if (speaker.trim()) {
          payload.append("speakers", speaker);
        }
      });

      const res = await fetch("/api/admin/save-regEvent", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to create registration event");
      }

      alert("Registration Event created successfully!");

      // reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        description: "",
        speakers: [""],
      });
    } catch (error) {
      console.error("Error creating registration event:", error);
      alert("Something went wrong while creating the registration event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      icon={ClipboardList}
      title="Add Registration Event"
      subtitle="Create an event that citizens can register for"
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
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className={label}>Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            className={input}
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
            rows={4}
            required
          />
        </div>

        {/* Speakers */}
        <div>
          <label className={label}>Speakers</label>
          <div className="space-y-2">
            {formData.speakers.map((speaker, index) => (
              <input
                key={index}
                type="text"
                value={speaker}
                onChange={(e) => handleSpeakerChange(index, e.target.value)}
                className={input}
                placeholder={`Speaker ${index + 1}`}
                required={index === 0} // first speaker is required
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addSpeakerField}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 transition hover:text-green-800"
          >
            <Plus className="h-4 w-4" />
            Add another speaker
          </button>
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting} className={submitBtn}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Registration Event"
          )}
        </button>
      </form>
    </FormShell>
  );
};
