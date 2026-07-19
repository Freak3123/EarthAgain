"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * Renders the main-site navbar/footer around the app — EXCEPT on tenant
 * sub-sites (e.g. /template), which ship their own self-contained chrome.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTenantSite = pathname?.startsWith("/template") ?? false;

  return (
    <>
      {!isTenantSite && <Navbar />}
      {children}
      {!isTenantSite && <Footer />}
    </>
  );
}
