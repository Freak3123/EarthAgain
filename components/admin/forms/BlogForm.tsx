"use client";
import React, { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import {
  FormShell,
  label,
  input,
  checkbox,
  fileInput,
  submitBtn,
} from "../shared";

export const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    author: "",
    date: "",
    readTime: "",
    category: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;

    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          data.append(key, value.toString()); // "true" or "false"
        } else {
          data.append(key, value as string);
        }
      });

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await fetch("/api/admin/save-blogs", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save blog");

      setMessage("✅ Blog saved successfully!");
      setFormData({
        title: "",
        excerpt: "",
        author: "",
        date: "",
        readTime: "",
        category: "",
        featured: false,
      });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell
      icon={FileText}
      title="Create Blog"
      subtitle="Write and publish a new article"
    >
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        <div>
          <label className={label}>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className={input}
          />
        </div>

        <div>
          <label className={label}>Excerpt</label>
          <textarea
            name="excerpt"
            placeholder="Excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className={input}
          />
        </div>

        <div>
          <label className={label}>Author</label>
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className={input}
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

        <div>
          <label className={label}>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={input}
          />
        </div>

        <div>
          <label className={label}>Read Time</label>
          <input
            type="text"
            name="readTime"
            placeholder="Read Time (e.g. 9 min read)"
            value={formData.readTime}
            onChange={handleChange}
            required
            className={input}
          />
        </div>

        <div>
          <label className={label}>Category</label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className={input}
          />
        </div>

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

        <button type="submit" disabled={loading} className={submitBtn}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Blog"
          )}
        </button>

        {message && (
          <p className="text-center text-sm text-stone-600">{message}</p>
        )}
      </form>
    </FormShell>
  );
};
