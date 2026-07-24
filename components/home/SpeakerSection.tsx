"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";

const allSpeakers = [
   {
    name: "KV Singdeo",
    designation: "An Indian politician",
    session: "An Indian politician from Odisha and a member of the former royal family of the princely state of Patna, Bolangir",
    image:
      "/speaker/Dy_CM_KV_Singh_Deo.jpg",
  },
  {
    name: "Ganesh Ram Singkhuntia",
    designation: "Environment Minister of Odisha",
    session: "Environment Minister of Odisha",
    image:
      "/speaker/Ganesh_Ram_Singh_Khuntia.jpg",
  },
  {
    name: "Professor Chetan Singh Solanki",
    designation: "Founder of the Energy Swaraj Foundation",
    session: "Founder of the Energy Swaraj Foundation",
    image:
      "/speaker/Professor Chetan Singh Solanki.jpg",
  },
  {
    name: "Arabinda K Padhee",
    designation: "IAS, department of Agriculture and Farmers' Empowerment",
    session: "IAS, department of Agriculture and Farmers' Empowerment",
    image:
      "/speaker/Arabinda K Padhee.webp",
  },
  {
    name: "Mr. Sidhesh Kr Mishra",
    designation: "Deputy Director, IGBC",
    session: "Deputy Director, IGBC",
    image:
      "/speaker/Mr. Sidhesh Kr Mishra.jpeg",
  },
  {
    name: "Kajri Misra",
    designation: "Dean of Xavier's school of human settlements",
    session: "Dean of Xavier's school of human settlements at XIM University, Bhubaneswar",
    image:
      "/speaker/Prof.-Kajri-Misra.jpg",
  },
  {
    name: "Ar Manonjaya Rath",
    designation: "Chairman, IGBC Bhubaneswar",
    session: "Chairman, IGBC Bhubaneswar",
    image:
      "/speaker/Ar Manonjaya Rath.jpeg",
  },
  {
    name: "Sambit Tripathy",
    designation: "Ex IRS, Founder, Livelihood Alternatives",
    session: "Ex IRS, Founder, Livelihood Alternatives",
    image:
      "/speaker/Sambit Tripathy.jpeg",
  },
  {
    name: "A. Ravindra",
    designation: "Head of WASSAN",
    session: "Head of WASSAN",
    image:
      "/speaker/A. Ravindra.jpg",
  },
  {
    name: "Licypriya Kangujam",
    designation: "Special Envoy of Timor-Leste for Climate Change",
    session: "Special Envoy of Timor-Leste for Climate Change",
    image:
      "/speaker/Licypriya Kangujam.jpg",
  },
  {
    name: "Shekhar Gupta",
    designation: "Indian journalist and author",
    session: "Indian journalist and author",
    image:
      "/speaker/Shekhar Gupta.jpg",
  },
  {
    name: "Punyasloka Panda",
    designation: "Founder of Youth for Sustainability",
    session: "Founder of Youth for Sustainability",
    image:
      "/speaker/Punyasloka Panda.jpeg",
  },
  {
    name: "Bhupendra Yadav",
    designation: "Union Cabinet Minister for Environment",
    session: "Union Cabinet Minister for Environment, Forest and Climate Change",
    image:
      "/speaker/Bhupender_Yadav.jpg",
  },
  {
    name: "Prasiddhi Singh",
    designation: "Founder, Prasiddhi Forest Foundation",
    session: "Founder, Prasiddhi Forest Foundation",
    image:
      "/speaker/Prasiddhi Singh.jpg",
  },
  {
    name: "Sarika Panda Bhatt",
    designation: "Founder Trustee, Raahgiri Foundation",
    session: "Founder Trustee, Raahgiri Foundation",
    image:
      "/speaker/Sarika Panda Bhatt.jpeg",
  },
  {
    name: "Sanjay Barnela",
    designation: "Film Maker",
    session: "Film Maker",
    image:
      "/speaker/Sanjay Barnela.jpg",
  },
  {
    name: "Pradeep Murthy",
    designation: "Muddy Boots Vacation",
    session: "Muddy Boots Vacation",
    image:
      "/speaker/Pradeep Murthy.jpg",
  },
  {
    name: "Deepsha Dhal",
    designation: "Co-founder, The Climate Network",
    session: "Co-founder, The Climate Network",
    image:
      "/speaker/Deepsha Dhal.jpg",
  },
  {
    name: "Dinesh Sharma",
    designation: "Member of Rajya Sabha",
    session: "Member of Rajya Sabha",
    image:
      "/speaker/Dinesh Sharma.jpg",
  },
  {
    name: "Dr. Abhinash Samal",
    designation: "MD, Empreo Prestige Private Limited",
    session: "MD, Empreo Prestige Private Limited",
    image:
      "/speaker/Dr. Abhinash Samal.jpg",
  },
  // {
  //   name: "Deepak Mohanty",
  //   designation: "IFS (Retd.)",
  //   session: "IFS (Retd.)",
  //   image:
  //     "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  // },
  {
    name: "Dr. Amitabh Saran",
    designation: "Founder and CEO, Altigreen",
    session: "Founder and CEO, Altigreen",
    image:
      "/speaker/Dr. Amitabh Saran.jpg",
  },
  {
    name: "Dr. Mrityunjay Mohapatra",
    designation: "Director General, Indian Meteorological Department",
    session: "Director General, Indian Meteorological Department",
    image:
      "/speaker/Dr. Mrityunjay Mohapatra.jpg",
  },
  // {
  //   name: "Bangaram Paikra",
  //   designation: "President at Chaupal Gramin Vikas Prashikshan",
  //   session: "President at Chaupal Gramin Vikas Prashikshan Evam Shodh Sansthan",
  //   image:
  //     "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  // },
  // {
  //   name: "Gladson Dungdung",
  //   designation: "Human rights activist and researcher",
  //   session: "Human rights activist and researcher",
  //   image:
  //     "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  // },
  {
    name: "Jennifer Larsen",
    designation: "US Counsel General in Hyderabad",
    session: "US Counsel General in Hyderabad",
    image:
      "/speaker/Jennifer Larsen.jpg",
  },
  {
    name: "JK Mohanty",
    designation: "Chairman and MD Swosti Group",
    session: "Chairman and Managing Director Swosti Group of Hotels, Resorts, Travels & Education",
    image:
      "/speaker/JK Mohanty.jpeg",
  },
  {
    name: "Lipika Singh Darai",
    designation: "Indian Filmmaker and Editor",
    session: "Indian Filmmaker and Editor",
    image:
      "/speaker/Lipika Singh Darai.jpg",
  },
  {
    name: "Nahar Muhammed",
    designation: "Researcher in Ecotourism",
    session: "Researcher in Ecotourism, Academic and Consultant, Tourism Sector",
    image:
      "/speaker/Nahar-Muhammed.jpg",
  },
  {
    name: "Akash Das Nayak",
    designation: "Member of Legislative Assembly Korei",
    session: "Member of Legislative Assembly Korei, Actor and Social Worker",
    image:
      "/speaker/Akash Das Nayak.jpg",
  },
  {
    name: "Prasanna Panda",
    designation: "President JSPL",
    session: "President JSPL",
    image:
      "/speaker/Prasanna Panda.jpeg",
  },
  {
    name: "Navajyoti Patnaik",
    designation: "Entrepreneur, MD, Jyoti Solar",
    session: "Entrepreneur, MD, Jyoti Solar",
    image:
      "/speaker/Navajyoti Patnaik.avif",
  },
  {
    name: "Pravat Kumar Panda",
    designation: "Founder of Retrod",
    session: "Founder of Retrod",
    image:
      "/speaker/Pravat Kumar Panda.jpeg",
  },
  {
    name: "Karuna Singh",
    designation: "Regional Director, Earth Day Network",
    session: "Regional Director, Earth Day Network",
    image:
      "/speaker/Karuna Singh.jpg",
  },
  {
    name: "Sri Naveen Patnaik ",
    designation: "Hon'ble leader of opposition, Odisha",
    session: "Hon'ble leader of opposition, Odisha",
    image:
      "/speaker/Shri-Naveen-Patnaik.jpg",
  },
  {
    name: "Amiya Patnaik",
    designation: "Former RD NALCO",
    session: "Former RD NALCO",
    image:
      "/speaker/Amiya Patnaik.jpg",
  },
  {
    name: "Sri Raghubar Das",
    designation: "Former Governor of Odisha",
    session: "Former Governor of Odisha",
    image:
      "/speaker/Sri Raghubar Das.jpg",
  },
];

export default function SpeakersSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Translate the row horizontally by exactly the amount it overflows the viewport.
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  useEffect(() => {
    const update = () => {
      if (rowRef.current) {
        setScrollDistance(
          Math.max(0, rowRef.current.scrollWidth - window.innerWidth)
        );
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="bg-[#0F140F] text-white">
      {/* Tall wrapper gives the vertical scroll room that drives the horizontal reel */}
      <section
        ref={targetRef}
        style={{ height: `${scrollDistance + 800}px` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-20">
          <div className="mx-auto w-full max-w-[109rem] px-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-10">
              All Speakers
            </h3>
          </div>

          <motion.div ref={rowRef} style={{ x }} className="flex gap-4 pl-4">
            {allSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="border-0 py-0 gap-0 w-72 shrink-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-80">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                  </div>
                </div>
                <CardContent className="px-4 h-20 flex items-center">
                  <p className="text-sm text-gray-600 font-medium line-clamp-3">
                    {speaker.session}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
