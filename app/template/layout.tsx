import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub-site Template · Earth Again",
  description:
    "A generic tenant sub-site template on the Earth Again multi-tenant platform — managed by an approved group, no code required.",
};

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inherits Geist + the site's cream background from the root layout, so the
  // tenant sub-site reads as part of the main Earth Again website.
  return (
    <div className="min-h-screen scroll-smooth bg-[#fefaf2] text-gray-900 antialiased">
      {children}
    </div>
  );
}
