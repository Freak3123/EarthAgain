"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * Renders the main-site navbar/footer around the app — EXCEPT on tenant
 * sub-sites (/template, and live/preview sub-sites at /s/[slug]), which ship
 * their own self-contained chrome (components/subsite/SiteChrome.tsx).
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTenantSite =
    pathname?.startsWith("/template") || pathname?.startsWith("/s/") || false;

  return (
    <>
      {!isTenantSite && <Navbar />}
      {children}
      {!isTenantSite && <Footer />}
    </>
  );
}
