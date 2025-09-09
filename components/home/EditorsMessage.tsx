"use client";
import { useState } from "react";
import Image from "next/image";

type EditorsMessageProps = {
  name: string;
  title?: string;
  avatarSrc: string; // e.g. "/editor.jpg"
  message: string;
  className?: string;
};

export default function EditorsMessage({
  name,
  title,
  avatarSrc,
  message,
  className = "",
}: EditorsMessageProps) {
  const [expanded, setExpanded] = useState(false);

  // Limit words (or characters) for preview
  const maxChars = 180; // adjust for mobile
  const isLong = message.length > maxChars;
  const preview = isLong ? message.slice(0, maxChars) + "..." : message;

  return (
    <section className={`bg-[#fefaf2] pt-20 ${className}`}>
      {/* Heading outside */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Editor&apos;s Message
      </h2>

      {/* Box with border */}
      <div className="flex items-center justify-center">
        <div className="max-w-5xl bg-white shadow-md hover:shadow-xl rounded-xl border border-gray-200 p-4 m-4 sm:p-6 lg:p-8 sm:m-6 lg:m-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Left: Editor image */}
            <div className="w-sm md:w-64 md:h-110 lg:w-84 shrink-0">
              <Image
                src={avatarSrc}
                alt={`${name}${title ? `, ${title}` : ""}`}
                width={550}
                height={1102}
                className="rounded-lg object-cover w-full h-full"
                priority
              />
            </div>

            {/* Right: Message */}
            <div className="flex-1">
              <div className="mb-3">
                <p className="text-lg font-semibold text-gray-900">{name}</p>
                {title && <p className="text-sm text-gray-500">{title}</p>}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {expanded ? message : preview}
              </p>

              {isLong && (
                <button
                  className="mt-2 text-blue-600 font-medium hover:underline focus:outline-none"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
