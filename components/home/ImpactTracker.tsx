'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, TreePine, Heart } from "lucide-react";

// Reusable animated counter component
const AnimatedCounter = ({ from = 0, to }: { from?: number; to: string }) => {
  const count = useMotionValue(from);
  const display = useTransform(count, (latest) => {
    const targetNumber = parseFloat(to.replace(/[^0-9.]/g, ''));
    const formatted = to.includes(',') ? Math.floor(latest).toLocaleString() : Math.floor(latest).toString();
    return to.includes('+') ? `${formatted}+` : formatted;
  });

  useEffect(() => {
    const targetNumber = parseFloat(to.replace(/[^0-9.]/g, ''));
    const controls = animate(count, targetNumber, {
      duration: 1.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [to, count]);

  return (
    <motion.span className="text-3xl font-bold text-gray-900 block">
      {display}
    </motion.span>
  );
};

export default function ImpactTracker() {
  const stats = [
    {
      icon: Users,
      value: "2,847",
      label: "Volunteers Joined",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      value: "156",
      label: "Events Hosted",
      color: "text-green-600",
    },
    {
      icon: TreePine,
      value: "12,450",
      label: "Trees Planted",
      color: "text-emerald-600",
    },
    {
      icon: Heart,
      value: "89",
      label: "Climate Panchayats",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="text-center py-16 bg-white">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Real-Time Impact</h3>
      <p className="text-xl text-gray-600 mb-12">
        See the growing impact of our collective action
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <AnimatedCounter to={stat.value} />
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
