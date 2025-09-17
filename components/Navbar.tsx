"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 200);
  });

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/climate-panchayat", label: "Climate Panchayat" },
    // { href: "/join-us", label: "Join Us" },
    // { href: "/blog", label: "Blog" },
    // { href: "/speakers", label: "Speakers" },
    // { href: "/admin", label: "Admin" },
    { href: "/citizen-voice", label: "Citizen Voice" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-100 transition-colors duration-300 ${
        isHome
          ? scrolled
            ? "bg-[#fefaf2] shadow-md"
            : "bg-transparent"
          : "bg-[#fefaf2] shadow-md"
      }`}
    >
      <div className="max-w-7xl z-150 mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link className="flex items-center" href="/">
            <Image
              src="/EARTH-AGAIN-LOGO-V1-2048x832.webp"
              alt="Earth Again Logo"
              width={200}
              height={50}
              className="h-10 sm:h-16 w-auto object-cover object-center"
              style={{ objectPosition: "center", objectFit: "cover" }}
            />
            <Image
              src={isHome && !scrolled ? "/sambad-white.png" : "/sambad-colored.png"}
              alt="Earth Again Logo"
              width={200}
              height={100}
              className="h-17 sm:h-25 w-auto object-cover object-center"
              style={{ objectPosition: "center", objectFit: "cover" }}
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base transition-colors ${
                  isActive
                    ? "text-green-600 font-semibold"
                    : isHome && !scrolled
                    ? "text-white"
                    : "text-gray-700 font-semibold"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Login + Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="/register"
            className="hidden lg:inline-block text-white bg-[#74B729] hover:bg-green-600 px-5 py-2.5 rounded-md transition"
          >
            Register
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden z-100 text-3xl text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <HiX />
            ) : (
              <HiMenu
                className={`${
                  isHome
                    ? scrolled
                      ? "text-gray-700"
                      : "text-white"
                    : "text-gray-700"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 lg:hidden bg-white h-screen w-full px-6 pb-4">
          <div className="flex flex-col pt-20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xl text-center font-medium text-gray-700 rounded-md hover:bg-green-50 py-3 ps-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="text-center text-xl text-white bg-green-600 hover:bg-green-700 mt-3 px-4 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
