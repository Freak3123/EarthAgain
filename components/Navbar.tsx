'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; // Install react-icons if not already

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    'Home',
    'About',
    'Events',
    'Climate Panchayat',
    // 'Join Us',
    'Blog',
    // 'Speakers',
    // 'Admin',
    'Score Card',
  ];

  return (
    <nav className="w-full bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-2xl font-extrabold text-green-600">🌿 Logo</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-md font-semibold text-gray-700 hover:text-green-600 transition-colors"
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
            className="lg:hidden text-3xl text-gray-700 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-6 pb-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition"
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
