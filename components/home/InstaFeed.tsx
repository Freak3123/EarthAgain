import React from 'react'
import Image from 'next/image'
import { Instagram, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export default function InstaFeed() {
  return (
    <div>
        <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Follow Our Journey</h2>
            <p className="text-xl text-gray-600 mb-8">Stay connected with daily updates from the movement</p>
            <div className="flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Instagram className="w-5 h-5 mr-2" />
                Follow @EarthAgainOdisha
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                Share Your Story
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                image: "tree plantation drive with volunteers",
                likes: "1.2k",
                caption: "Amazing turnout at today's plantation drive! 🌱",
              },
              {
                image: "climate panchayat discussion in village",
                likes: "856",
                caption: "Powerful discussions at Cuttack Climate Panchayat 💚",
              },
              {
                image: "youth climate summit participants",
                likes: "2.1k",
                caption: "Young leaders shaping our future! 🌍",
              },
              {
                image: "sustainable farming workshop",
                likes: "743",
                caption: "Learning sustainable farming techniques 🚜",
              },
              { image: "renewable energy exhibition", likes: "1.5k", caption: "Solar power for every home! ☀️" },
              { image: "community cleanup drive", likes: "967", caption: "Clean communities, green future 🧹" },
              { image: "environmental awareness rally", likes: "1.8k", caption: "Marching for Mother Earth! 🌎" },
              { image: "school children planting saplings", likes: "1.3k", caption: "Future guardians of nature 👶🌳" },
            ].map((post, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer py-0"
              >
                <div className="relative">
                  <div className='h-64 overflow-hidden'>
                  <Image
                    src="https://images.unsplash.com/photo-1660924198520-85447f410eff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluc3RhZ3JhbXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Instagram post"
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                  />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-x-4 pb-6">
                  <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

