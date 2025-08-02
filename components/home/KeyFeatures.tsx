import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Climate Panchayats",
    image:
      "https://images.unsplash.com/photo-1542897841-138e818c6685?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/climate-panchayat",
    desc: "Community-driven climate discussions in every constituency, empowering local voices in environmental decision-making.",
  },
  {
    title: "Workshops & Events",
    image:
      "https://plus.unsplash.com/premium_photo-1700801936521-348308ae2db3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHZpbGxhZ2UlMjBwZW9wbGUlMjBnYXRoZXJpbmd8ZW58MHx8MHx8fDA%3D",
    href: "/events",
    desc: "Educational workshops, tree plantation drives, and awareness campaigns designed to create lasting environmental impact.",
  },
  {
    title: "Youth Engagement",
    image:
      "https://images.unsplash.com/photo-1751666455816-ea2ef616502c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGVudmlyb25tZW50JTIweW91dGh8ZW58MHx8MHx8fDA%3D",
    href: "/join-us",
    desc: "Empowering young leaders to drive climate action in their communities through innovative programs and leadership opportunities.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="bg-[#fefaf2] py-25 sm:pb-32 pb-272 px-10 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            However you choose to care,
            <br />
            you’ll make an impact here.
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Whether you're planting a tree, leading a workshop, or simply
            learning something new — Earth Again gives you the tools, the space,
            and the community to turn care into climate action. Every choice
            matters. Every voice counts. And together, we create real change for
            Odisha and beyond.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            Inspire Me
          </Link>
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 h-125 gap-12 sm:gap-6">
          <Link href={cards[0].href} className="relative self-end group h-110 ">
            <div className="overflow-hidden rounded-lg group h-110 shadow-md">
              <Image
                width={800}
                height={500}
                loading="lazy"
                src={cards[0].image}
                alt={cards[0].title}
                className="object-cover h-110 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-lg">{cards[0].desc}</p>
            </div>

            <h3 className="text-lg mt-2 font-semibold text-black flex items-center group-hover:text-green-700 transition">
              {cards[0].title}
              <ArrowRight className="ml-2 h-5 w-5 text-[#A22D10]" />
            </h3>
          </Link>

          <Link href={cards[1].href} className="relative group h-110 ">
            <div className="overflow-hidden rounded-lg group h-110 shadow-md">
              <Image
                width={800}
                height={500}
                loading="lazy"
                src={cards[1].image}
                alt={cards[1].title}
                className="object-cover h-110 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-lg">{cards[1].desc}</p>
            </div>

            <h3 className="text-lg mt-2 font-semibold text-black flex items-center group-hover:text-green-700 transition">
              {cards[1].title}
              <ArrowRight className="ml-2 h-5 w-5 text-[#A22D10]" />
            </h3>
          </Link>

          <Link href={cards[2].href} className="relative self-end group h-110">
            <div className="overflow-hidden rounded-lg group h-110 shadow-md">
              <Image
                width={800}
                height={500}
                loading="lazy"
                src={cards[2].image}
                alt={cards[2].title}
                className="object-cover h-110 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-lg">{cards[2].desc}</p>
            </div>

            <h3 className="text-lg mt-2 font-semibold text-black flex items-center group-hover:text-green-700 transition">
              {cards[2].title}
              <ArrowRight className="ml-2 h-5 w-5 text-[#A22D10]" />
            </h3>
          </Link>
        </div>
      </div>
    </section>
  );
}
