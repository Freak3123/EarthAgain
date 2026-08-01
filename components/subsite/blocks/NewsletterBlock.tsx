"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import type { NewsletterData } from "@/lib/blocks/types";

/**
 * Public newsletter section. The form is a local demo (no email is stored) —
 * matching app/template/page.tsx. Wiring it to a real list is out of Phase 3
 * scope.
 */
export default function NewsletterBlock({ data }: { data: NewsletterData }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section
      id="subscribe"
      aria-labelledby="subscribe-title"
      className="scroll-mt-24 px-5 pb-20 sm:px-8"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[var(--accent)] px-6 py-14 text-white sm:px-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              <span className="h-px w-6 bg-white/60" />
              {data.kicker}
            </span>
            <h2
              id="subscribe-title"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              {data.title}
            </h2>
            <p className="mt-4 text-white/80">{data.body}</p>
          </div>

          <div>
            {subscribed ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                  <Check className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <div>
                  <p className="font-semibold">You&apos;re subscribed.</p>
                  <p className="text-sm text-white/70">
                    This is a demo form — no email is stored.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 sm:flex-row"
              >
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
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--accent)] transition-colors duration-200 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
  );
}
