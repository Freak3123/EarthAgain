"use client";

import Link from "next/link";
import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 300); 
  });

  const navItems = [
    "Home",
    "About",
    "Events",
    "Climate Panchayat",
    // 'Join Us',
    "Blog",
    // 'Speakers',
    // 'Admin',
    "Score Card",
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-2xl font-extrabold text-green-600">
              🌿 Logo
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-md  ${
                scrolled ? "text-gray-700 font-semibold" : "text-white"
              } hover:text-green-600 transition-colors`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Login + Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-md transition"
          >
            Login
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden z-100 text-3xl text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu className="text-white"/>}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 lg:hidden bg-white h-screen w-full px-6 pb-4">
          <div className="flex flex-col pt-20">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-md text-center font-medium text-gray-700 rounded-md hover:bg-green-50 py-3 ps-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-center text-white bg-green-600 hover:bg-green-700 mt-3 px-4 py-2 rounded-md transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
