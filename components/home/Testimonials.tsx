import React from 'react'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

export default function Testimonials () {
  return (
    <div>
        <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Voices of Change</h2>
            <p className="text-xl text-gray-600">Hear from leaders, citizens, and youth who are driving the movement</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Naveen Patnaik",
                designation: "Chief Minister, Odisha",
                quote:
                  "Earth Again represents the collective will of Odisha to lead India's climate action. Every citizen's participation will make this movement historic.",
                image: "Chief Minister speaking at environmental event",
                category: "Political Leader",
              },
              {
                name: "Priya Sharma",
                designation: "Student Leader, KIIT University",
                quote:
                  "As young people, we're not just participants but leaders in this movement. Earth Again gives us the platform to create the future we want to live in.",
                image: "young female student leader at climate rally",
                category: "Youth Leader",
              },
              {
                name: "Ramesh Patel",
                designation: "Farmer, Cuttack District",
                quote:
                  "The sustainable farming workshops have transformed how I work with nature. My yield increased while protecting the environment for my children.",
                image: "farmer in organic field showing sustainable practices",
                category: "Community Member",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=64&width=64&query=${testimonial.image}`}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.designation}</p>
                      <Badge className="mt-1 text-xs bg-blue-100 text-blue-800">{testimonial.category}</Badge>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic">"{testimonial.quote}"</blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
