"use client";
import React, { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import {
  FormShell,
  label,
  input,
  checkbox,
  fileInput,
  submitBtn,
  SpeakerFormData,
} from "../shared";

export const SpeakerForm = () => {
  const [formData, setFormData] = useState<SpeakerFormData>({
    name: "",
    session: "",
    image: "",
    isFeatured: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    field: keyof SpeakerFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("session", formData.session);
      payload.append("isFeatured", String(formData.isFeatured));

      if (selectedFile) {
        payload.append("image", selectedFile);
      }

      const res = await fetch("/api/admin/save-speakers", {
        method: "POST",
        body: payload, // ✅ multipart/form-data
      });

      if (!res.ok) {
        throw new Error("Failed to create speaker");
      }

      alert("Speaker created successfully!");

      // reset form
      setFormData({
        name: "",
        session: "",
        image: "",
        isFeatured: false,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating speaker:", error);
      alert("Something went wrong while creating the speaker");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      icon={Users}
      title="Add Speaker"
      subtitle="Register a speaker and their session"
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        {/* Name */}
        <div>
          <label className={label}>Speaker Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Session */}
        <div>
          <label className={label}>Session</label>
          <input
            type="text"
            value={formData.session}
            onChange={(e) => handleChange("session", e.target.value)}
            className={input}
            required
          />
        </div>

        {/* Featured */}
        <label className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-stone-50/60 px-3.5 py-2.5">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleChange("isFeatured", e.target.checked)}
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
            "Save Speaker"
          )}
        </button>
      </form>
    </FormShell>
  );
};
