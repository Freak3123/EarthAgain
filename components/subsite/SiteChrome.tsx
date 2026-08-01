"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { IBlock, ISiteSettings } from "@/lib/models/site";
import type { ContactItem } from "@/lib/blocks/types";
import { primaryBtn } from "./shared";

/* -------------------------------------------------------------------------- */
/*  Sub-site chrome: header (nav + mobile menu), footer, floating platform     */
/*  badge. Driven entirely by site `settings` (+ `blocks`, for the footer's    */
/*  auto-filled Contact column). Sets --accent so the block renderers pick     */
/*  up the tenant's colour. See design §5 (site chrome).                       */
/* -------------------------------------------------------------------------- */

function socialIcon(platform: string): LucideIcon {
  const p = (platform || "").toLowerCase();
  if (p.includes("twitter") || p.includes("x")) return Twitter;
  if (p.includes("instagram")) return Instagram;
  if (p.includes("youtube")) return Youtube;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("linkedin")) return Linkedin;
  return Globe;
}

type ContactCategory = "email" | "phone" | "address";

function categorizeContact(label: string): ContactCategory | null {
  const l = (label || "").toLowerCase();
  if (l.includes("email") || l.includes("mail")) return "email";
  if (l.includes("phone") || l.includes("call")) return "phone";
  if (l.includes("address") || l.includes("location")) return "address";
  return null;
}

/**
 * Auto-fill the footer's Contact column from the site's own Contact block —
 * "whatever is available" (email/phone/address), skipping hidden blocks and
 * any non-matching ("Other") entries. No block, or an empty match → no column.
 */
function extractFooterContact(blocks: IBlock[]): (ContactItem & { category: ContactCategory })[] {
  const contactBlock = blocks.find((b) => b.type === "contact" && !b.hidden);
  const items = contactBlock ? (contactBlock.data as { items?: unknown }).items : undefined;
  if (!Array.isArray(items)) return [];

  const order: ContactCategory[] = ["email", "phone", "address"];
  const found = new Map<ContactCategory, ContactItem & { category: ContactCategory }>();
  for (const item of items as ContactItem[]) {
    const category = categorizeContact(item?.label);
    if (category && item.value && !found.has(category)) {
      found.set(category, { ...item, category });
    }
  }
  return order.map((c) => found.get(c)).filter((x): x is ContactItem & { category: ContactCategory } => !!x);
}

function contactHref(item: { category: ContactCategory; value: string }): string | null {
  if (item.category === "email") return `mailto:${item.value}`;
  if (item.category === "phone") return `tel:${item.value.replace(/[^\d+]/g, "")}`;
  return null;
}

function BrandMark({
  brandName,
  tagline,
  logoUrl,
}: {
  brandName: string;
  tagline: string;
  logoUrl: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={brandName}
          width={144}
          height={144}
          className="h-9 w-9 shrink-0 rounded object-contain"
        />
      ) : (
        <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true" fill="none">
          <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7 23c3.2 0 3.2-3 6.5-3s3.3 3 6.5 3 3.2-3 6.5-3 3.3 3 6.5 3"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 28c3.2 0 3.2-3 6.5-3s3.3 3 6.5 3 3.2-3 6.5-3 3.3 3 6.5 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="20" cy="13" r="2.5" fill="var(--accent)" />
        </svg>
      )}
      <span className="leading-none">
        <span className="block text-lg font-semibold tracking-tight">{brandName}</span>
        {tagline && (
          <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}

export default function SiteChrome({
  settings,
  blocks = [],
  children,
}: {
  settings: ISiteSettings;
  /** Used only to auto-fill the footer's Contact column from the site's own Contact block. */
  blocks?: IBlock[];
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = Array.isArray(settings.nav) ? settings.nav : [];
  const socials = Array.isArray(settings.socials) ? settings.socials : [];
  const brandName = settings.brandName || "Sub-site";
  const accent = settings.accent || "#16a34a";
  const footerText =
    (settings.footer && typeof settings.footer.description === "string"
      ? (settings.footer.description as string)
      : "") || settings.tagline;
  const footerContact = extractFooterContact(blocks);

  return (
    <div
      className="min-h-screen scroll-smooth bg-[#fefaf2] text-gray-900 antialiased"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* ------------------------------- NAVBAR ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-green-100 bg-[#fefaf2]/85 backdrop-blur supports-[backdrop-filter]:bg-[#fefaf2]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className="text-gray-900" aria-label={`${brandName} — home`}>
            <BrandMark
              brandName={brandName}
              tagline={settings.tagline}
              logoUrl={settings.logoUrl}
            />
          </a>

          {nav.length > 0 && (
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {nav.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href}
                  className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <a href="#subscribe" className={`${primaryBtn} hidden sm:inline-flex`}>
              Subscribe
            </a>
            {nav.length > 0 && (
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-900 transition-colors hover:bg-green-50 lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>

        {menuOpen && nav.length > 0 && (
          <div className="border-t border-green-100 bg-[#fefaf2] lg:hidden">
            <nav
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8"
              aria-label="Mobile"
            >
              {nav.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-green-50"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#subscribe"
                onClick={() => setMenuOpen(false)}
                className={`${primaryBtn} mt-2`}
              >
                Subscribe
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">{children}</main>

      {/* ------------------------------- FOOTER ------------------------------ */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-sm">
              <span className="text-white">
                <BrandMark
                  brandName={brandName}
                  tagline={settings.tagline}
                  logoUrl={settings.logoUrl}
                />
              </span>
              {footerText && (
                <p className="mt-4 text-sm leading-relaxed text-white/60">{footerText}</p>
              )}
              {socials.length > 0 && (
                <div className="mt-5 flex gap-2">
                  {socials.map((s, i) => {
                    const Icon = socialIcon(s.platform);
                    return (
                      <a
                        key={i}
                        href={s.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.platform || "Social link"}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {nav.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                    Quick Links
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {nav.map((l, i) => (
                      <li key={`${l.href}-${i}`}>
                        <a
                          href={l.href}
                          className="text-sm text-white/70 transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                  Join Earth Again
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Register", href: "/register" },
                    { label: "Join Us", href: "/join-us" },
                    { label: "Host With Us", href: "/host-form" },
                    { label: "Start A Local Chapter", href: "/start-chapter" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {footerContact.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                    Contact
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {footerContact.map((c) => {
                      const href = contactHref(c);
                      return (
                        <li key={c.category}>
                          {href ? (
                            <a
                              href={href}
                              className="text-sm text-white/70 transition-colors hover:text-white"
                            >
                              {c.value}
                            </a>
                          ) : (
                            <span className="text-sm text-white/70">{c.value}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
            <p className="inline-flex items-center gap-1.5">
              Powered by
              <Link
                href="/"
                className="font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Earth Again
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating platform badge — always visible (platform branding stays). */}
      <Link
        href="/"
        aria-label="Earth Again — platform home"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-green-100 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur transition-shadow hover:shadow-xl"
      >
        <span className="text-[11px] font-medium text-gray-500">Powered by</span>
        <Image
          src="/EARTH-AGAIN-LOGO-V1-2048x832.webp"
          alt="Earth Again"
          width={120}
          height={49}
          className="h-4 w-auto"
          priority
        />
      </Link>
    </div>
  );
}
