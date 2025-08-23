import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Climate Panchayats",
    image:
      "/3.jpeg",
    href: "/climate-panchayat",
    desc: "Community-driven climate discussions in every constituency, empowering local voices in environmental decision-making.",
  },
  {
    title: "Workshops & Events",
    image:
      "/1.jpeg",
    href: "/events",
    desc: "Educational workshops, tree plantation drives, and awareness campaigns designed to create lasting environmental impact.",
  },
  {
    title: "Youth Engagement",
    image:
      "/2.jpeg",
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
            you&apos;ll make an impact here.
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Whether you&apos;re planting a tree, leading a workshop, or simply
            learning something new — Earth Again gives you the tools, the space,
            and the community to turn care into climate action. Make your voice matter, let us create real change for Odisha & beyond, together.
          </p>
          <Link
            href="/join-us"
            className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            Find your role
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
                src={"/home1.jpg"}
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
                src={"/home2.jpg"}
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
                src={"/home3.jpg"}
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
