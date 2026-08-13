"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/**
 * The "images inside" a post — a responsive thumbnail grid below the article
 * body, where clicking one opens it full size.
 */
export default function BlogGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? images[openIndex] : null;

  // Escape closes the lightbox, and the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!images.length) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Gallery</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open image ${i + 1} of ${images.length} full size`}
            className="group relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79b727] focus-visible:ring-offset-2"
          >
            <Image
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — enlarged image`}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close image"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
          >
            <X className="h-6 w-6" />
          </button>
          {/* Stop the backdrop handler from firing when the image is clicked. */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[85vh] w-full max-w-5xl"
          >
            <Image
              src={open}
              alt={`${title} — image ${(openIndex ?? 0) + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
