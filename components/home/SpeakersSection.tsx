"use client";

import React, { useState, useEffect } from "react";
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
      "https://drive.google.com/file/d/13Fp7yjASINrSHqxEiJ40TUml7v0F9jZS/view?usp=sharing",
  },
  {
    name: "Bhupendra Yadav",
    designation: "Union Cabinet Minister for Environment",
    session: "Union Cabinet Minister for Environment, Forest and Climate Change",
    image:
      "https://drive.google.com/file/d/1tdE-Ylhxf4sunF6k3di3y0w2R1R4XMGW/view?usp=sharing",
  },
  {
    name: "Ganesh Ram Singkhuntia",
    designation: "Environment Minister of Odisha",
    session: "Environment Minister of Odisha",
    image:
      "https://drive.google.com/file/d/15Xhdlo3i9fyMUO97miap-WMw2ZESTG5P/view?usp=sharing",
  },
  {
    name: "Sri Naveen Patnaik ",
    designation: "Hon'ble leader of opposition, Odisha",
    session: "Hon'ble leader of opposition, Odisha",
    image:
      "https://drive.google.com/file/d/1UoZoZngIlg6nyoxwVXxuTpq91OAeHDJF/view?usp=sharing",
  },
  {
    name: "Professor Chetan Singh Solanki",
    designation: "Founder of the Energy Swaraj Foundation",
    session: "Founder of the Energy Swaraj Foundation",
    image:
      "https://drive.google.com/file/d/1EbxQLKIHoPVMcZQmZSTvZkM9JbxABPVe/view?usp=sharing",
  },
  {
    name: "Arabinda K Padhee",
    designation: "IAS, department of Agriculture and Farmers' Empowerment",
    session: "IAS, department of Agriculture and Farmers' Empowerment",
    image:
      "https://drive.google.com/file/d/1gX6jadE-VM9V2-45emjbu8LQi2Vuo14x/view?usp=sharing",
  },
  {
    name: "Mr. Sidhesh Kr Mishra",
    designation: "Deputy Director, IGBC",
    session: "Deputy Director, IGBC",
    image:
      "https://drive.google.com/file/d/1Da3-Z96vZxyppekgUYuO0XNmp7kVJ7ax/view?usp=sharing",
  },
  {
    name: "Kajri Misra",
    designation: "Dean of Xavier's school of human settlements",
    session: "Dean of Xavier's school of human settlements at XIM University, Bhubaneswar",
    image:
      "https://drive.google.com/file/d/1_jHLHX-qwca3I3-H4D9MtYIpOhLdvcu0/view?usp=sharing",
  },
  {
    name: "Ar Manonjaya Rath",
    designation: "Chairman, IGBC Bhubaneswar",
    session: "Chairman, IGBC Bhubaneswar",
    image:
      "https://drive.google.com/file/d/1RVO-8ZQDf0m7SDbh6avLp7uhPzCx1uAm/view?usp=sharing",
  },
  {
    name: "Sambit Tripathy",
    designation: "Ex IRS, Founder, Livelihood Alternatives",
    session: "Ex IRS, Founder, Livelihood Alternatives",
    image:
      "https://drive.google.com/file/d/1nycedush6wKU1lvwLPF8vWYMCBYgAE51/view?usp=sharing",
  },
  {
    name: "A. Ravindra",
    designation: "Head of WASSAN",
    session: "Head of WASSAN",
    image:
      "https://drive.google.com/file/d/1nycedush6wKU1lvwLPF8vWYMCBYgAE51/view?usp=sharing",
  },
  {
    name: "Licypriya Kangujam",
    designation: "Special Envoy of Timor-Leste for Climate Change",
    session: "Special Envoy of Timor-Leste for Climate Change",
    image:
      "https://drive.google.com/file/d/1tWR5FmJXEWyzvlwigsQSFu6mSnVr7C3t/view?usp=sharing",
  },
  {
    name: "Shekhar Gupta",
    designation: "Indian journalist and author",
    session: "Indian journalist and author",
    image:
      "https://drive.google.com/file/d/1spd3bnVg1ZKwas0vkDPKrDlsD-Uv10cU/view?usp=sharing",
  },
  {
    name: "Punyasloka Panda",
    designation: "Founder of Youth for Sustainability",
    session: "Founder of Youth for Sustainability",
    image:
      "https://drive.google.com/file/d/1yPcc-vQK806exs3N-mzsZr6tHpL7WJRy/view?usp=sharing",
  },
  {
    name: "Prasiddhi Singh",
    designation: "Founder, Prasiddhi Forest Foundation",
    session: "Founder, Prasiddhi Forest Foundation",
    image:
      "https://drive.google.com/file/d/1q0sPBeL58yeBI7Bta_RoMYPTzBcmTXkL/view?usp=sharing",
  },
  {
    name: "Sarika Panda Bhatt",
    designation: "Founder Trustee, Raahgiri Foundation",
    session: "Founder Trustee, Raahgiri Foundation",
    image:
      "https://drive.google.com/file/d/1rNuIda9z52z6P4lr363g4VwuAYe7ozxs/view?usp=sharing",
  },
  {
    name: "Sanjay Barnela",
    designation: "Film Maker",
    session: "Film Maker",
    image:
      "https://drive.google.com/file/d/1CawSTb_pKl3wS2Tldxd0J4EoXMCgvn0j/view?usp=sharing",
  },
  {
    name: "Pradeep Murthy",
    designation: "Muddy Boots Vacation",
    session: "Muddy Boots Vacation",
    image:
      "https://drive.google.com/file/d/1t0uGNPcjPFeBLaO3h2psx9g1k33_-g-c/view?usp=sharing",
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
      "https://drive.google.com/file/d/1K-qEPtd4EG6XE3U9ss6dELUGbpIAtbCS/view?usp=sharing",
  },
  {
    name: "Dr. Abhinash Samal",
    designation: "MD, Empreo Prestige Private Limited",
    session: "MD, Empreo Prestige Private Limited",
    image:
      "https://drive.google.com/file/d/1hKYacWz0EWcxnvz9j8zsRojv6cf9-6W3/view?usp=sharing",
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
      "https://drive.google.com/file/d/1rj5bNZsJ_sbLmyZaQwH-NbOmeCeKEera/view?usp=sharing",
  },
  {
    name: "Dr. Mrityunjay Mohapatra",
    designation: "Director General, Indian Meteorological Department",
    session: "Director General, Indian Meteorological Department",
    image:
      "https://drive.google.com/file/d/1zlE9wzrpyxep9Kx7iJZv2_UbTSyZuAkd/view?usp=sharing",
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
      "https://drive.google.com/file/d/1QyO6PTcdE1Gg2m4BcLa6SnBQoqnNVof4/view?usp=sharing",
  },
  {
    name: "JK Mohanty",
    designation: "Chairman and MD Swosti Group",
    session: "Chairman and Managing Director Swosti Group of Hotels, Resorts, Travels & Education",
    image:
      "https://drive.google.com/file/d/1QDeWbpzXWok8WhjsEti5SF2KC5czjC7f/view?usp=sharing",
  },
  {
    name: "Lipika Singh Darai",
    designation: "Indian Filmmaker and Editor",
    session: "Indian Filmmaker and Editor",
    image:
      "https://drive.google.com/file/d/10NaGN9plspDrmbeXF7iPBGlGCedOQ5rX/view?usp=sharing",
  },
  {
    name: "Nahar Muhammed",
    designation: "Researcher in Ecotourism",
    session: "Researcher in Ecotourism, Academic and Consultant, Tourism Sector",
    image:
      "https://drive.google.com/file/d/19S4RFhhMdLmOm9vP6sDdrH6Us9TZ_xIs/view?usp=sharing",
  },
  {
    name: "Akash Das Nayak",
    designation: "Member of Legislative Assembly Korei",
    session: "Member of Legislative Assembly Korei, Actor and Social Worker",
    image:
      "https://drive.google.com/file/d/1YizpXDfs35I0BXHh6ISkKgxqW6EExyy1/view?usp=sharing",
  },
  {
    name: "Prasanna Panda",
    designation: "President JSPL",
    session: "President JSPL",
    image:
      "https://drive.google.com/file/d/1U3SFQ4F8lxtOHHn35IJm00Vv2qKKDtju/view?usp=sharing",
  },
  {
    name: "Navajyoti Patnaik",
    designation: "Entrepreneur, MD, Jyoti Solar",
    session: "Entrepreneur, MD, Jyoti Solar",
    image:
      "https://drive.google.com/file/d/16m3Byqf0jHufPPvF68pJcIqCiAF0I743/view?usp=sharing",
  },
  {
    name: "Pravat Kumar Panda",
    designation: "Founder of Retrod",
    session: "Founder of Retrod",
    image:
      "https://drive.google.com/file/d/166Ke_UyXkMCLES8k0IwRO2lHR37cz98R/view?usp=sharing",
  },
  {
    name: "Karuna Singh",
    designation: "Regional Director, Earth Day Network",
    session: "Regional Director, Earth Day Network",
    image:
      "https://drive.google.com/file/d/1SQ78AIqTNfA0V0QNiuSKWl72utWTccBy/view?usp=sharing",
  },
  {
    name: "Amiya Patnaik",
    designation: "Former RD NALCO",
    session: "Former RD NALCO",
    image:
      "https://drive.google.com/file/d/1SQ78AIqTNfA0V0QNiuSKWl72utWTccBy/view?usp=sharing",
  },
  {
    name: "Sri Raghubar Das",
    designation: "Former Governor of Odisha",
    session: "Former Governor of Odisha",
    image:
      "https://drive.google.com/file/d/10q5m3k7tZbV5pmKs9BI42rSh25FWtHwX/view?usp=sharing",
  },
  // Add more speakers as needed
];

export default function SpeakersSection() {
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isSmall = useMediaQuery({ maxWidth: 639 });
  const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 });
  const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isExtraLarge = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

