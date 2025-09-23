'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) return setMessage("Please enter a valid email");
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/stayupdated", { email });

      if (res.data.success) {
        setMessage("✅ Thank you! Please check your inbox.");
        setEmail("");
      } else {
        setMessage(res.data.error || "❌ Subscription failed");
      }
    } catch (err: any) {
      console.error("❌ Axios error:", err);
      setMessage(
        err.response?.data?.error || "❌ Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Earth Again</span>
            </div>
            <p className="text-gray-400 text-sm">
              A flagship initiative by Sambad Group, Odisha’s largest media
              conglomerate, this programme renews our commitment to
              sustainability and conservation through community-driven climate
              action across the state.
            </p>
            <Link
              href="https://www.instagram.com/theearthagain_movement?igsh=cXNjeHh3a2x6cTVz"
              className="flex gap-2"
            >
              <Instagram className="w-5 h-5 text-gray-300" />
              <p className="text-sm text-gray-300">theearthagain_movement</p>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/about", label: "About Movement" },
                { href: "/events", label: "Events" },
                { href: "/climate-panchayat", label: "Climate Panchayat" },
                { href: "/join-us", label: "Join Us" },
                { href: "/speakers", label: "Speakers" },
                // { href: "/blog", label: "Blog" },
                { href: "/citizen-voice", label: "Citizen Voice" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>eaoutreach2025@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 6372904717</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Bhubaneswar, Odisha</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-gray-400 text-sm">
              Share your email to stay connected with us.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
              {message && (
                <p className="text-sm text-gray-300 mt-2">{message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Earth Again Movement by Sambad Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
