"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="bg-[#0F140F] text-white py-36">
      <h3 className="text-2xl sm:text-4xl font-bold text-white/80 sm:mb-2 md:ml-44">
        From Fields to Forums
      </h3>
      <h2 className="sm:text-6xl text-4xl font-bold text-green-600 sm:mb-2 md:ml-44">
        They Are Leading 
      </h2>
      <h3 className="sm:text-6xl text-4xl font-bold text-white/80 mb-16 md:ml-44">
        A Movement That Matters
      </h3>
    <div>
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="normal"
        className="w-full"
      />
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="fast"
        className="w-full"
      />
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
        className="w-full"
      />
    </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Naveen Patnaik",
    title: "Chief Minister, Odisha",
    quote:
      "Earth Again represents the collective will of Odisha to lead India's climate action. Every citizen's participation will make this movement historic.",
    image: null,
  },
  {
    name: "Priya Sharma",
    title: "Student Leader, KIIT University",
    quote:
      "As young people, we're not just participants but leaders in this movement. Earth Again gives us the platform to create the future we want to live in.",
    image: null,
  },
  {
    name: "Ramesh Patel",
    title: "Farmer, Cuttack District",
    quote:
      "The sustainable farming workshops have transformed how I work with nature. My yield increased while protecting the environment for my children.",
    image: null,
  },
  {
    name: "Dr. Ayesha Khan",
    title: "Ecologist, Odisha Forestry Research",
    quote:
      "Earth Again bridges research and reality. It’s rare to see science and community working hand in hand this well.",
    image: null,
  },
  {
    name: "Sanjay Mohanty",
    title: "Teacher, Bhubaneswar High School",
    quote:
      "My students are now more aware and involved in sustainability projects than ever before. This movement is planting seeds in every classroom.",
    image: null,
  },
];
