import { ArrowRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function UpcomingEvents() {
  return (
    <div className="bg-gray-50">
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-600">Join us in these transformative climate action events</p>
            </div>
            <Link href="/events">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                View All Events <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Climate Panchayat - Bhubaneswar",
                date: "August 15, 2024",
                time: "10:00 AM",
                location: "Kalinga Stadium",
                image: "community meeting in traditional Odisha setting with people discussing climate",
              },
              {
                title: "Youth Climate Summit",
                date: "August 22, 2024",
                time: "9:00 AM",
                location: "KIIT University",
                image: "young students participating in environmental workshop",
              },
              {
                title: "Tree Plantation Drive",
                date: "September 5, 2024",
                time: "6:00 AM",
                location: "Nandankanan",
                image: "volunteers planting saplings in forest area",
              },
            ].map((event, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    // 
                    src="https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop"
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900">{event.date}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button className="w-full p-5 bg-green-600 hover:bg-green-700">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
