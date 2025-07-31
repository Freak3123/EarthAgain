"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CountdownTimer({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  var mytext = "Count Every Second Until the Event Begins";
  const targetDate = new Date(target).getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (targetDate < Date.now()) {
    mytext = "Event ended";
  }
  return (
    <div className="flex flex-col lg:flex-row md:justify-between items-center gap-8">
      <div className="flex flex-col w-full justify-start items-start text-left space-y-4">
        {/* Headline */}
        <h3 className="text-3xl font-bold text-white">{mytext}</h3>

        {/* Description */}
        <p className="text-base font-semibold text-white/80 max-w-xl leading-relaxed">
          Join us as we move closer to an inspiring and impactful gathering.{" "}
          <br />
          Don’t miss the opportunity to connect, learn, and grow. <br />
          Every second counts — secure your spot before time runs out.
        </p>

        {/* Register Button */}
        <div className="pt-4">
          <Link
            href="/register"
            className="inline-block bg-emerald-100 text-black/80 hover:text-black px-6 py-3 rounded-md text-sm md:text-base font-medium transition"
          >
            Register Now
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 md:max-w-2xl md:min-w-xl max-mr-10">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <Card key={index} className="bg-white/10 border-white/20 md:py-4 py-0 px-2">
            <CardContent className="p-4 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.value}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-3xl font-bold text-white"
                >
                  {item.value.toString().padStart(2, "0")}
                </motion.div>
              </AnimatePresence>
              <div className="text-sm text-white/80">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
