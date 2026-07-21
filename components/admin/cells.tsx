"use client";
import React from "react";

/* Shared table-cell renderers for the admin form-data tables. */

/** Turn a hyphenated enum value into a readable label, e.g. "local-entity" → "Local Entity". */
export const prettify = (v?: string) =>
  (v ?? "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "—";

/** Stacked email + phone cell. */
export const ContactCell = ({
  email,
  phone,
}: {
  email?: string;
  phone?: string;
}) => (
  <div>
    {email && <div className="font-mono text-xs text-stone-600">{email}</div>}
    {phone && <div className="font-mono text-xs text-stone-500">{phone}</div>}
    {!email && !phone && <span className="text-stone-400">—</span>}
  </div>
);

/** Wrapping badge list for array fields (skills, partnership types). */
export const BadgeList = ({ items }: { items?: string[] }) =>
  items && items.length ? (
    <div className="flex flex-wrap gap-1">
      {items.map((it, i) => (
        <span
          key={i}
          className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
        >
          {prettify(it)}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-stone-400">—</span>
  );

/** Truncated external link cell. */
export const LinkCell = ({ href }: { href?: string }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-[180px] truncate text-xs text-green-700 underline hover:text-green-800"
      title={href}
    >
      {href}
    </a>
  ) : (
    <span className="text-stone-400">—</span>
  );
