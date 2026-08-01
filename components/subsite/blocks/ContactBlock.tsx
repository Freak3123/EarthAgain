import { Mail, Phone, MapPin, Newspaper, type LucideIcon } from "lucide-react";
import type { ContactData, ContactItem } from "@/lib/blocks/types";
import { Kicker, asArray } from "../shared";

function iconFor(label: string): LucideIcon {
  const l = (label || "").toLowerCase();
  if (l.includes("email") || l.includes("mail")) return Mail;
  if (l.includes("phone") || l.includes("call")) return Phone;
  if (l.includes("address") || l.includes("location")) return MapPin;
  return Newspaper;
}

export default function ContactBlock({ data }: { data: ContactData }) {
  const items = asArray<ContactItem>(data.items);
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8"
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <Kicker>{data.kicker}</Kicker>
          <h2
            id="contact-title"
            className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
          >
            {data.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{data.body}</p>
        </div>

        <dl className="grid gap-6 sm:grid-cols-2">
          {items.map((c, i) => {
            const Icon = iconFor(c.label);
            return (
              <div
                key={i}
                className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
              >
                <Icon className="h-5 w-5 text-[var(--accent)]" />
                <dt className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {c.label}
                </dt>
                <dd className="mt-1 font-medium text-gray-900">{c.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
