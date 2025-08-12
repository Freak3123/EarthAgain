"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMediaQuery } from "react-responsive";

const featuredSpeakers = [
  {
    name: "KV Singdeo",
    designation: "An Indian politician",
    session: "An Indian politician from Odisha and a member of the former royal family of the princely state of Patna, Bolangir",
    image:
      "https://images.unsplash.com/photo-1594234591488-128c2968837a?w=500&auto=format&fit=crop&q=60",
    expertise: "Biodiversity & Sustainable Agriculture",
  },
  {
    name: "Sunita Narain",
    designation: "Director, Centre for Science and Environment",
    session: "Climate Policy & Community Action",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
    expertise: "Environmental Policy & Water Management",
  },
  {
    name: "Dr. A.P.J. Abdul Kalam (Memorial)",
    designation: "Former President of India",
    session: "Vision 2030: Green India",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
    expertise: "Science & Technology for Environment",
  },
];
//image: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
// const allSpeakers = Array.from({ length: 40 }, (_, i) => ({
//   name: `Speaker ${i + 1}`,
//   designation: "Designation",
//   session: `Session Topic ${i + 1}`,
//   image:
//     "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
//   expertise: "Expertise / Event name",
// }));

const allSpeakers = [
  {
    name: "KV Singdeo",
    designation: "An Indian politician",
    session: "An Indian politician from Odisha and a member of the former royal family of the princely state of Patna, Bolangir",
    image:
      "https://images.unsplash.com/photo-1594234591488-128c2968837a?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Bhupendra Yadav",
    designation: "Union Cabinet Minister for Environment",
    session: "Union Cabinet Minister for Environment, Forest and Climate Change",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Ganesh Ram Singkhuntia",
    designation: "Environment Minister of Odisha",
    session: "Environment Minister of Odisha",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Sri Naveen Patnaik ",
    designation: "Hon'ble leader of opposition, Odisha",
    session: "Hon'ble leader of opposition, Odisha",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Professor Chetan Singh Solanki",
    designation: "Founder of the Energy Swaraj Foundation",
    session: "Founder of the Energy Swaraj Foundation",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Arabinda K Padhee",
    designation: "IAS, department of Agriculture and Farmers' Empowerment",
    session: "IAS, department of Agriculture and Farmers' Empowerment",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Mr. Sidhesh Kr Mishra",
    designation: "Deputy Director, IGBC",
    session: "Deputy Director, IGBC",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Kajri Misra",
    designation: "Dean of Xavier's school of human settlements",
    session: "Dean of Xavier's school of human settlements at XIM University, Bhubaneswar",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Ar Manonjaya Rath",
    designation: "Chairman, IGBC Bhubaneswar",
    session: "Chairman, IGBC Bhubaneswar",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Sambit Tripathy",
    designation: "Ex IRS, Founder, Livelihood Alternatives",
    session: "Ex IRS, Founder, Livelihood Alternatives",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "A. Ravindra",
    designation: "Head of WASSAN",
    session: "Head of WASSAN",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Licypriya Kangujam",
    designation: "Special Envoy of Timor-Leste for Climate Change",
    session: "Special Envoy of Timor-Leste for Climate Change",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Shekhar Gupta",
    designation: "Indian journalist and author",
    session: "Indian journalist and author",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Punyasloka Panda",
    designation: "Founder of Youth for Sustainability",
    session: "Founder of Youth for Sustainability",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Prasiddhi Singh",
    designation: "Founder, Prasiddhi Forest Foundation",
    session: "Founder, Prasiddhi Forest Foundation",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Sarika Panda Bhatt",
    designation: "Founder Trustee, Raahgiri Foundation",
    session: "Founder Trustee, Raahgiri Foundation",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Sanjay Barnela",
    designation: "Film Maker",
    session: "Film Maker",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Pradeep Murthy",
    designation: "Muddy Boots Vacation",
    session: "Muddy Boots Vacation",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Deepsha Dhal",
    designation: "Co-founder, The Climate Network",
    session: "Co-founder, The Climate Network",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Dinesh Sharma",
    designation: "Member of Rajya Sabha",
    session: "Member of Rajya Sabha",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Dr. Abhinash Samal",
    designation: "MD, Empreo Prestige Private Limited",
    session: "MD, Empreo Prestige Private Limited",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Deepak Mohanty",
    designation: "IFS (Retd.)",
    session: "IFS (Retd.)",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Dr. Amitabh Saran",
    designation: "Founder and CEO, Altigreen",
    session: "Founder and CEO, Altigreen",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Dr. Mrityunjay Mohapatra",
    designation: "Director General, Indian Meteorological Department",
    session: "Director General, Indian Meteorological Department",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Bangaram Paikra",
    designation: "President at Chaupal Gramin Vikas Prashikshan",
    session: "President at Chaupal Gramin Vikas Prashikshan Evam Shodh Sansthan",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Gladson Dungdung",
    designation: "Human rights activist and researcher",
    session: "Human rights activist and researcher",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Jennifer Larsen",
    designation: "US Counsel General in Hyderabad",
    session: "US Counsel General in Hyderabad",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "JK Mohanty",
    designation: "Chairman and MD Swosti Group",
    session: "Chairman and Managing Director Swosti Group of Hotels, Resorts, Travels & Education",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Lipika Singh Darai",
    designation: "Indian Filmmaker and Editor",
    session: "Indian Filmmaker and Editor",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Nahar Muhammed",
    designation: "Researcher in Ecotourism",
    session: "Researcher in Ecotourism, Academic and Consultant, Tourism Sector",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Akash Das Nayak",
    designation: "Member of Legislative Assembly Korei",
    session: "Member of Legislative Assembly Korei, Actor and Social Worker",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Prasanna Panda",
    designation: "President JSPL",
    session: "President JSPL",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Navajyoti Patnaik",
    designation: "Entrepreneur, MD, Jyoti Solar",
    session: "Entrepreneur, MD, Jyoti Solar",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Pravat Kumar Panda",
    designation: "Founder of Retrod",
    session: "Founder of Retrod",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Karuna Singh",
    designation: "Regional Director, Earth Day Network",
    session: "Regional Director, Earth Day Network",
    image:
      "https://images.unsplash.com/photo-1580894732444-84cf8e64267d?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Amiya Patnaik",
    designation: "Former RD NALCO",
    session: "Former RD NALCO",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  {
    name: "Sri Raghubar Das",
    designation: "Former Governor of Odisha",
    session: "Former Governor of Odisha",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60",
  },
  // Add more speakers as needed
];

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);
  const isSmall = useMediaQuery({ maxWidth: 639 });
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 });
  const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isExtraLarge = useMediaQuery({ minWidth: 1024 });

  let sliceCount = 5;
  if (isSmall) sliceCount = 4;
  else if (isMedium) sliceCount = 3;
  else if (isLarge) sliceCount = 4;
  else if (isExtraLarge) sliceCount = 5;

  const displayedSpeakers = showAll
    ? allSpeakers
    : allSpeakers.slice(0, sliceCount);

  return (
    <div className="bg-[#0F140F] text-white">
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Featured Speakers */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Speakers
            </h2>
            <p className="text-xl text-white/80">
              Learn from environmental leaders and experts
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
            {featuredSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="border-0 pt-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-60">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-sm opacity-90">{speaker.designation}</p>
                  </div>
                </div>
                <CardContent className="p-4 py-0">
                  <div className="mb-3">
                    <Badge className="bg-green-100 w-[39vw] sm:w-auto text-green-800 font-bold text-xs">
                    <p className="truncate p-1 px-2">
                      {speaker.expertise}
                    </p>
                    </Badge>
                  </div>
                  <p className="text-gray-600 font-medium mb-4">
                    {speaker.session}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Speakers Expandable */}
        <div className="mt-20 mx-auto max-w-[109rem]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              All Speakers
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-0 text-green-600 hover:text-green-500 hover:bg-transparent bg-transparent"
            >
              {showAll ? "Show Less" : "View All Speakers"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-4">
            {displayedSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="border-0 pt-0 h-auto shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative w-full h-60">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    {/* <p className="text-sm opacity-90">{speaker.designation}</p> */}
                  </div>
                </div>
                <CardContent className="p-4 py-0">
                  {/* <div className="mb-3">
                    <Badge className="bg-green-100 w-[39vw] sm:w-auto text-green-800 font-bold text-xs">
                    <p className="truncate p-1 px-2">
                      {speaker.expertise}
                    </p>
                    </Badge>
                  </div> */}
                  <p className="text-gray-600 font-medium mb-4">
                    {speaker.session}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

