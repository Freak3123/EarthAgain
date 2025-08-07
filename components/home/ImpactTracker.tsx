'use client';

import { UserGroupIcon, CalendarDaysIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Image from 'next/image';

type StatCard = {
  number: string;
  label: string;
  icon: React.ReactElement;
  bgColor: string;
  rotate: string;
  hoverRotate: string;
  image?: string;
};

const cards: StatCard[] = [
  {
    number: '2,847',
    label: 'Volunteers Joined',
    icon: <UserGroupIcon className="w-10 h-10" />,
    bgColor: 'bg-green-500',
    rotate: '-rotate-3',
    hoverRotate: 'hover:-rotate-6',
    image: "https://www.svgrepo.com/show/312786/people-hugging.svg"
  },
  {
    number: '12,450',
    label: 'Trees Planted',
    icon: <SparklesIcon className="w-10 h-10" />,
    bgColor: 'bg-blue-200',
    rotate: 'rotate-2',
    hoverRotate: 'hover:rotate-6',
    image: "https://www.svgrepo.com/show/247533/trees-tree.svg"
  },
  {
    number: '156',
    label: 'Events Hosted',
    icon: <CalendarDaysIcon className="w-10 h-10" />,
    bgColor: 'bg-[#B16C2A]',
    
    rotate: '-rotate-2',
    hoverRotate: 'hover:-rotate-6',
    image: "https://www.svgrepo.com/show/312520/man-dancing.svg"
  },
  {
    number: '89',
    label: 'Climate Panchayats',
    icon: <GlobeAltIcon className="w-10 h-10" />,
    bgColor: 'bg-lime-300',
    rotate: 'rotate-3',
    hoverRotate: 'hover:rotate-6',
    image: "https://www.svgrepo.com/show/228711/network-group.svg"
  },
];

const ImpactTracker = () => {
  return (
    <section className="bg-[#fefaf2] text-white py-20 px-4 sm:px-10">
      <h3 className="text-2xl sm:text-4xl font-bold text-black/80 sm:mb-2 md:ml-44">
        Don't believe us?
      </h3>
      <h2 className="sm:text-6xl text-4xl font-bold text-green-600 sm:mb-2 md:ml-44">
        The Numbers
      </h2>
      <h3 className="sm:text-6xl text-4xl font-bold text-black/80 mb-12 md:ml-44">
        Speak for Themselves
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 max-w-6xl mx-0 md:mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`transition-transform duration-300 ease-in-out transform z-${i*10} ${card.rotate} ${card.hoverRotate} ${card.bgColor} text-black rounded-xl shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6 hover:shadow-2xl hover:z-50 hover:scale-105`}
          >
            <div className="sm:mb-4 mb-2">{card.icon}</div>
            <h4 className="sm:text-3xl text-xl font-extrabold">{card.number}</h4>
            <p className="sm:mt-2 sm:text-lg font-semibold">{card.label}</p>
            <Image
              src={card.image ?? ""}
              alt={card.label}
              width={100}
              height={100}
              className="mt-2 sm:p-8 pb-0 sm:w-full"/>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactTracker;
