"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Send,
  Check,
  Newspaper,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Generic tenant sub-site template.                                         */
/*  Themed to match the main Earth Again site and reuses its home-page         */
/*  elements (bold section headers with "View All", shadow-xl cards, green     */
/*  CTA band). Swap the placeholder copy/logo/colors per tenant.              */
/* -------------------------------------------------------------------------- */

const accent = "#16a34a";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Featured", href: "#featured" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------- brand mark ------------------------------- */
function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true" fill="none">
        <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 23c3.2 0 3.2-3 6.5-3s3.3 3 6.5 3 3.2-3 6.5-3 3.3 3 6.5 3"
          stroke={accent}
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
        <circle cx="20" cy="13" r="2.5" fill={accent} />
      </svg>
      <span className="leading-none">
        <span className="block text-lg font-semibold tracking-tight">
          Organization Name
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
          Tagline goes here
        </span>
      </span>
    </span>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#16a34a]">
      <span className="h-px w-6 bg-[#16a34a]" />
      {children}
    </span>
  );
}

// Reuses the home page's "View All" button (transparent, terracotta accent).
function ViewAll({ label = "View All" }: { label?: string }) {
  return (
    <Button
      variant="default"
      className="cursor-pointer border-0 bg-transparent text-[#A22D10] shadow-none hover:bg-transparent hover:text-amber-950"
    >
      {label} <ArrowRight className="h-5 w-5" />
    </Button>
  );
}

// Section header row matching the home page (bold title + optional View All).
function SectionHead({
  kicker,
  title,
  id,
  viewAll,
}: {
  kicker: string;
  title: string;
  id?: string;
  viewAll?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2
          id={id}
          className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
        >
          {title}
        </h2>
      </div>
      {viewAll && <ViewAll label={viewAll} />}
    </div>
  );
}

// Gradient placeholder that mirrors the home card's image area (h-52 + badge).
function CardImage({ tone, badge }: { tone: string; badge?: string }) {
  return (
    <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${tone}`}>
      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:18px_18px]" />
      {badge && (
        <div className="absolute bottom-3 left-3 rounded bg-black/50 px-3 py-1 text-sm text-white shadow backdrop-blur-md">
          {badge}
        </div>
      )}
    </div>
  );
}

const cardShell =
  "group flex flex-col overflow-hidden rounded-lg border-0 bg-white p-0 text-black shadow-xl";

const primaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16a34a] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#15803d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fefaf2]";
const ghostBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition-colors duration-200 hover:bg-[#79b727] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fefaf2]";

/* --------------------------- placeholder data ---------------------------- */
const featured = [
  { badge: "Category", tone: "from-teal-700 to-teal-900", title: "Featured item one", by: "Author name", meta: "5 min read" },
  { badge: "Category", tone: "from-green-800 to-green-950", title: "Featured item two", by: "Author name", meta: "6 min read" },
  { badge: "Category", tone: "from-emerald-600 to-green-800", title: "Featured item three", by: "Author name", meta: "4 min read" },
];

const events = [
  { place: "Location", tone: "from-green-700 to-emerald-900", title: "Event one", time: "10:00 AM", date: "Month 00, 2026" },
  { place: "Location", tone: "from-lime-700 to-green-900", title: "Event two", time: "11:00 AM", date: "Month 00, 2026" },
  { place: "Location", tone: "from-teal-700 to-emerald-900", title: "Event three", time: "03:00 PM", date: "Month 00, 2026" },
];

const posts = [
  { badge: "Category", tone: "from-green-700 to-emerald-900", title: "Blog post one", by: "Author name", date: "Jan 01", read: "5 min" },
  { badge: "Category", tone: "from-amber-700 to-orange-900", title: "Blog post two", by: "Author name", date: "Jan 02", read: "6 min" },
  { badge: "Category", tone: "from-green-800 to-green-950", title: "Blog post three", by: "Author name", date: "Jan 03", read: "4 min" },
  { badge: "Category", tone: "from-teal-700 to-teal-900", title: "Blog post four", by: "Author name", date: "Jan 04", read: "7 min" },
  { badge: "Category", tone: "from-emerald-600 to-green-800", title: "Blog post five", by: "Author name", date: "Jan 05", read: "5 min" },
  { badge: "Category", tone: "from-lime-700 to-green-900", title: "Blog post six", by: "Author name", date: "Jan 06", read: "8 min" },
];

const team = [
  { name: "Team member one", role: "Role / Title", tone: "from-green-700 to-emerald-900" },
  { name: "Team member two", role: "Role / Title", tone: "from-teal-700 to-teal-900" },
  { name: "Team member three", role: "Role / Title", tone: "from-green-800 to-green-950" },
  { name: "Team member four", role: "Role / Title", tone: "from-amber-700 to-orange-900" },
];

const placeholderText =
  "This is placeholder text for the template. Replace it with your own content — a short description that tells visitors what this section is about.";

/* ================================== PAGE ================================== */
export default function SubSiteTemplate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      {/* ------------------------------- NAVBAR ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-green-100 bg-[#fefaf2]/85 backdrop-blur supports-[backdrop-filter]:bg-[#fefaf2]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className="text-gray-900" aria-label="Organization Name — home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#subscribe" className={`${primaryBtn} hidden sm:inline-flex`}>
              Subscribe
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-900 transition-colors hover:bg-green-50 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-green-100 bg-[#fefaf2] lg:hidden">
            <nav
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8"
              aria-label="Mobile"
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-green-50"
                >
                  {l.label}
                </a>
              ))}
              <a href="#subscribe" onClick={() => setMenuOpen(false)} className={`${primaryBtn} mt-2`}>
                Subscribe
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* ---------------------------- HERO SECTION ------------------------- */}
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
          <Kicker>Hero Section</Kicker>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6.5vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.02em] text-gray-900">
            A short, bold headline goes right here.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-gray-600">
            {placeholderText}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#featured" className={primaryBtn}>
              Primary action
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#about" className={ghostBtn}>
              Secondary action
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>Detail one</span>
            <span aria-hidden="true">·</span>
            <span>Detail two</span>
            <span aria-hidden="true">·</span>
            <span>Detail three</span>
          </div>
        </section>

        {/* ------------------------- HIGHLIGHT SECTION ----------------------- */}
        <section className="border-y border-green-100 bg-white/50">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-800">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
              <span className="absolute left-4 top-4 rounded-full bg-[#16a34a] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Featured
              </span>
            </div>
            <div>
              <Kicker>Highlight</Kicker>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                Highlight Section
              </h2>
              <p className="mt-4 text-gray-600">{placeholderText}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">
                <span className="font-medium text-gray-900">By Author name</span>
                <span aria-hidden="true">·</span>
                <span>0 min read</span>
              </div>
              <a
                href="#featured"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A22D10] transition-colors hover:text-amber-950"
              >
                Continue reading
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* -------------------------- ABOUT SECTION -------------------------- */}
        <section
          id="about"
          aria-labelledby="about-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8"
        >
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <div>
              <Kicker>About</Kicker>
              <h2
                id="about-title"
                className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl"
              >
                About Section
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <p>{placeholderText}</p>
              <p>{placeholderText}</p>
              <a
                href="#team"
                className="inline-flex items-center gap-1.5 font-semibold text-[#A22D10] transition-colors hover:text-amber-950"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-green-100 pt-12 sm:grid-cols-4">
            {[
              { value: "100+", label: "Metric one" },
              { value: "50", label: "Metric two" },
              { value: "12", label: "Metric three" },
              { value: "1,000", label: "Metric four" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold tracking-tight text-gray-900">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- FEATURED SECTION ------------------------ */}
        <section
          id="featured"
          aria-labelledby="featured-title"
          className="scroll-mt-24 border-y border-green-100 bg-white/40"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <SectionHead
              id="featured-title"
              kicker="Featured"
              title="Featured Section"
              viewAll="View All"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((a) => (
                <Card key={a.title} className={cardShell}>
                  <CardImage tone={a.tone} badge={a.badge} />
                  <CardContent className="flex flex-1 flex-col justify-between pb-6">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">{a.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {placeholderText}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4" />
                          <span>{a.by}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{a.meta}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------- EVENTS SECTION ------------------------- */}
        <section
          id="events"
          aria-labelledby="events-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8"
        >
          <SectionHead
            id="events-title"
            kicker="Events"
            title="Events Section"
            viewAll="View All"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <Card key={ev.title} className={cardShell}>
                <CardImage tone={ev.tone} badge={ev.place} />
                <CardContent className="flex flex-1 flex-col justify-between gap-5 pb-6">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{ev.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {placeholderText}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{ev.date}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full cursor-pointer bg-[#79b727] text-white hover:bg-[#338c20]">
                    <Calendar className="h-4 w-4" />
                    RSVP
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --------------------------- BLOG SECTION -------------------------- */}
        <section
          id="blog"
          aria-labelledby="blog-title"
          className="scroll-mt-24 border-y border-green-100 bg-white/40"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <SectionHead
              id="blog-title"
              kicker="Blog"
              title="Blog Section"
              viewAll="View All"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Card key={p.title} className={cardShell}>
                  <CardImage tone={p.tone} badge={p.badge} />
                  <CardContent className="flex flex-1 flex-col justify-between pb-6">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">{p.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {placeholderText}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">{p.by}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.read}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------- TEAM SECTION -------------------------- */}
        <section
          id="team"
          aria-labelledby="team-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8"
        >
          <SectionHead
            id="team-title"
            kicker="Team"
            title="Team Section"
            viewAll="View All"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((m) => {
              const initials = m.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div key={m.name}>
                  <div
                    className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${m.tone}`}
                  >
                    <span className="text-3xl font-semibold text-white">{initials}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{m.name}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">{m.role}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------ NEWSLETTER SECTION ----------------------- */}
        <section
          id="subscribe"
          aria-labelledby="subscribe-title"
          className="scroll-mt-24 px-5 pb-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#79b727] px-6 py-14 text-white sm:px-14">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  <span className="h-px w-6 bg-white/60" />
                  Newsletter
                </span>
                <h2
                  id="subscribe-title"
                  className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
                >
                  Newsletter Section
                </h2>
                <p className="mt-4 text-white/80">{placeholderText}</p>
              </div>

              <div>
                {subscribed ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      <Check className="h-5 w-5 text-green-700" />
                    </span>
                    <div>
                      <p className="font-semibold">You&apos;re subscribed.</p>
                      <p className="text-sm text-white/70">
                        This is a demo form — no email is stored.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-700 transition-colors duration-200 hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      <Send className="h-4 w-4" />
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------- CONTACT SECTION ------------------------ */}
        <section
          id="contact"
          aria-labelledby="contact-title"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
        >
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <div>
              <Kicker>Contact</Kicker>
              <h2
                id="contact-title"
                className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              >
                Contact Section
              </h2>
              <p className="mt-4 text-lg text-gray-600">{placeholderText}</p>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Mail, label: "Email", value: "email@example.com" },
                { icon: Phone, label: "Phone", value: "+00 000 000 0000" },
                { icon: MapPin, label: "Address", value: "123 Street, City" },
                { icon: Newspaper, label: "Other", value: "@yourhandle" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                  <c.icon className="h-5 w-5 text-[#16a34a]" />
                  <dt className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {c.label}
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* ------------------------------- FOOTER ------------------------------ */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-sm">
              <span className="text-white">
                <Logo />
              </span>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {placeholderText}
              </p>
              <div className="mt-5 flex gap-2">
                {[Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#top"
                    aria-label="Social link"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {[
                { h: "Column one", links: ["Link one", "Link two", "Link three", "Link four"] },
                { h: "Column two", links: ["Link one", "Link two", "Link three", "Link four"] },
                { h: "Column three", links: ["Link one", "Link two", "Link three", "Link four"] },
              ].map((col) => (
                <div key={col.h}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                    {col.h}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a
                          href="#top"
                          className="text-sm text-white/70 transition-colors hover:text-white"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Organization Name. All rights reserved.</p>
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

      {/* Floating platform badge — Earth Again logo, always visible */}
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
    </>
  );
}
