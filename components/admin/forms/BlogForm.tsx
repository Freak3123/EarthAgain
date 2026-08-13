"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, X, Pencil } from "lucide-react";
import {
  FormShell,
  label,
  input,
  checkbox,
  fileInput,
  submitBtn,
} from "../shared";
import SiteDistributionField, { Distribution } from "../SiteDistributionField";
import { RichTextEditor } from "../RichTextEditor";

/** A post being edited — the subset of Blog the form round-trips. */
export interface EditableBlog {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  date?: string;
  readTime?: string;
  category?: string;
  image?: string;
  images?: string[];
  featured?: boolean;
  siteIds?: string[];
  showOnMainSite?: boolean;
}

const emptyForm = {
  title: "",
  excerpt: "",
  author: "",
  date: "",
  readTime: "",
  category: "",
  featured: false,
};

/** Thumbnail with a corner remove button, used for both new and saved images. */
const Thumb = ({
  src,
  alt,
  onRemove,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
}) => (
  <div className="group relative overflow-hidden rounded-lg border border-stone-200">
    <img src={src} alt={alt} className="h-24 w-full object-cover" />
    <button
      type="button"
      onClick={onRemove}
      title="Remove image"
      aria-label={`Remove ${alt}`}
      className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-stone-600 shadow transition hover:bg-red-50 hover:text-red-600"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </div>
);

export const BlogForm = ({
  mode = "admin",
  onSaved,
  blog,
  onCancel,
}: {
  /** "site" hides the distribution selector — a subadmin's post is always
   *  auto-scoped to their own site server-side, never broadcast elsewhere. */
  mode?: "admin" | "site";
  onSaved?: () => void;
  /** Pass a post to edit it in place; omit to create a new one. */
  blog?: EditableBlog;
  onCancel?: () => void;
}) => {
  const editing = Boolean(blog?._id);

  const [formData, setFormData] = useState(emptyForm);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  /** Gallery images already saved on the post; removing one drops it on save. */
  const [keepImages, setKeepImages] = useState<string[]>([]);
  /** Newly picked gallery files, uploaded on save. */
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [distribution, setDistribution] = useState<Distribution>({
    showOnMainSite: true,
    siteIds: [],
  });

  // Load the post being edited (and reset everything when switching posts).
  useEffect(() => {
    setMessage("");
    setSelectedFile(null);
    setNewImages([]);
    if (!blog) {
      setFormData(emptyForm);
      setContent("");
      setKeepImages([]);
      setDistribution({ showOnMainSite: true, siteIds: [] });
      return;
    }
    setFormData({
      title: blog.title ?? "",
      excerpt: blog.excerpt ?? "",
      author: blog.author ?? "",
      // <input type="date"> only accepts YYYY-MM-DD.
      date: blog.date ? String(blog.date).slice(0, 10) : "",
      readTime: blog.readTime ?? "",
      category: blog.category ?? "",
      featured: Boolean(blog.featured),
    });
    setContent(blog.content ?? "");
    setKeepImages(blog.images ?? []);
    setDistribution({
      showOnMainSite: blog.showOnMainSite ?? true,
      siteIds: (blog.siteIds ?? []).map(String),
    });
  }, [blog]);

  // Object URLs must be revoked, or every re-pick leaks one.
  const newImagePreviews = useMemo(
    () => newImages.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [newImages]
  );
  useEffect(
    () => () => newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url)),
    [newImagePreviews]
  );

  const primaryPreview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );
  useEffect(
    () => () => {
      if (primaryPreview) URL.revokeObjectURL(primaryPreview);
    },
    [primaryPreview]
  );

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

    // The editor is not a native field, so `required` can't cover it.
    if (!content.trim()) {
      setMessage("❌ Please write the blog content.");
      return;
    }
    // A new post needs a primary image; an edited one keeps its existing one.
    if (!editing && !selectedFile) {
      setMessage("❌ Please choose a primary image.");
      return;
    }

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
      data.append("content", content);

      if (selectedFile) {
        data.append("image", selectedFile);
      }
      newImages.forEach((file) => data.append("images", file));
      data.append("siteIds", JSON.stringify(distribution.siteIds));
      data.append("showOnMainSite", String(distribution.showOnMainSite));

      if (editing) {
        data.append("id", blog!._id as string);
        data.append("keepImages", JSON.stringify(keepImages));
      }

      const res = await fetch("/api/admin/save-blogs", {
        method: editing ? "PUT" : "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save blog");

      if (editing) {
        setMessage("✅ Blog updated successfully!");
      } else {
        setMessage("✅ Blog saved successfully!");
        setFormData(emptyForm);
        setContent("");
        setSelectedFile(null);
        setKeepImages([]);
        setNewImages([]);
        setDistribution({ showOnMainSite: true, siteIds: [] });
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      setMessage(editing ? "❌ Error updating blog" : "❌ Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell
      icon={editing ? Pencil : FileText}
      title={editing ? "Edit Blog" : "Create Blog"}
      subtitle={
        editing
          ? "Update this article and its images"
          : "Write and publish a new article"
      }
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
          <p className="mt-1.5 text-xs text-stone-500">
            A short description. Shown on the blog card, as the lead paragraph
            of the article, and as the page&apos;s search/social preview text.
          </p>
        </div>

        <div>
          <label className={label}>Content</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write the article…"
          />
          <p className="mt-1.5 text-xs text-stone-500">
            The main body of the article, shown when the blog card is opened.
          </p>
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
          <label className={label}>Primary Image</label>
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
          <p className="mt-1.5 text-xs text-stone-500">
            Shown on the blog card, and at the top of the opened article.
            {editing && " Leave empty to keep the current image."}
          </p>
        </div>

        {primaryPreview ? (
          <img
            src={primaryPreview}
            alt="Primary image preview"
            className="mt-2 h-48 w-full rounded-lg object-cover"
          />
        ) : (
          editing &&
          blog?.image && (
            <img
              src={blog.image}
              alt="Current primary image"
              className="mt-2 h-48 w-full rounded-lg object-cover"
            />
          )
        )}

        <div>
          <label className={label}>Images Inside (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              if (picked.length) setNewImages((prev) => [...prev, ...picked]);
              // Reset so picking the same file again still fires onChange.
              e.target.value = "";
            }}
            className={fileInput}
          />
          <p className="mt-1.5 text-xs text-stone-500">
            Extra images, shown as a gallery below the article content.
          </p>
        </div>

        {(keepImages.length > 0 || newImagePreviews.length > 0) && (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {keepImages.map((url) => (
              <Thumb
                key={url}
                src={url}
                alt="Saved gallery image"
                onRemove={() =>
                  setKeepImages((prev) => prev.filter((u) => u !== url))
                }
              />
            ))}
            {newImagePreviews.map(({ file, url }) => (
              <Thumb
                key={url}
                src={url}
                alt={file.name}
                onRemove={() =>
                  setNewImages((prev) => prev.filter((f) => f !== file))
                }
              />
            ))}
          </div>
        )}

        {mode === "admin" && (
          <SiteDistributionField value={distribution} onChange={setDistribution} />
        )}

        <div className="space-y-2.5">
          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {editing ? "Updating..." : "Saving..."}
              </span>
            ) : editing ? (
              "Update Blog"
            ) : (
              "Save Blog"
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full cursor-pointer rounded-lg border border-stone-300 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          )}
        </div>

        {message && (
          <p className="text-center text-sm text-stone-600">{message}</p>
        )}
      </form>
    </FormShell>
  );
};
