import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

export default function SpeakersSection() {
  return (
    <div>
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Speakers</h2>
              <p className="text-xl text-gray-600">Learn from environmental leaders and experts</p>
            </div>
            <Link href="/speakers">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                View All Speakers <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Vandana Shiva",
                designation: "Environmental Activist & Author",
                session: "Keynote: Seeds of Change",
                image: "environmental activist speaking at podium",
                expertise: "Biodiversity & Sustainable Agriculture",
              },
              {
                name: "Sunita Narain",
                designation: "Director, Centre for Science and Environment",
                session: "Climate Policy & Community Action",
                image: "environmental policy expert in discussion",
                expertise: "Environmental Policy & Water Management",
              },
              {
                name: "Dr. A.P.J. Abdul Kalam (Memorial)",
                designation: "Former President of India",
                session: "Vision 2030: Green India",
                image: "memorial tribute to former president",
                expertise: "Science & Technology for Environment",
              },
            ].map((speaker, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={`/placeholder.svg?height=300&width=400&query=${speaker.image}`}
                    alt={speaker.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-sm opacity-90">{speaker.designation}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge className="bg-green-100 text-green-800 text-xs">{speaker.expertise}</Badge>
                  </div>
                  <p className="text-gray-600 font-medium mb-4">{speaker.session}</p>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

