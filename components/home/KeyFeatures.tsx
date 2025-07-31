import React from 'react'
import { Card, CardContent } from '../ui/card'
import { ArrowRight, CalendarDays, Heart, Users } from 'lucide-react'
import Link from 'next/link'
import ImpactTracker from './ImpactTracker'

export default function KeyFeatures() {
  return (
    <div className='bg-gray-50'>
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Earth Again Special?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive approach to climate action that brings together communities, youth, and leaders across
              Odisha for meaningful environmental change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Climate Panchayats</h3>
                <p className="text-gray-600 mb-4">
                  Community-driven climate discussions in every constituency, empowering local voices in environmental
                  decision-making.
                </p>
                <Link
                  href="/climate-panchayat"
                  className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Workshops & Events</h3>
                <p className="text-gray-600 mb-4">
                  Educational workshops, tree plantation drives, and awareness campaigns designed to create lasting
                  environmental impact.
                </p>
                <Link
                  href="/events"
                  className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                >
                  View Events <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Youth Engagement</h3>
                <p className="text-gray-600 mb-4">
                  Empowering young leaders to drive climate action in their communities through innovative programs and
                  leadership opportunities.
                </p>
                <Link href="/join" className="text-green-600 hover:text-green-700 font-medium inline-flex items-center">
                  Get Involved <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Impact Tracker */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ImpactTracker />
        </div>
      </section>
    </div>
  )
}

