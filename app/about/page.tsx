import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Calendar, Users, TreePine, Lightbulb } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import InstaFeed from "@/components/home/InstaFeed"

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-22 bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">About Earth Again Movement</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-green-600">Mission</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Earth Again is Odisha's most ambitious sustainability movement, bringing together communities, youth, and
              leaders to create lasting environmental change through collective action and grassroots initiatives.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                      To mobilize every citizen of Odisha in a 60-day intensive climate action campaign that creates
                      awareness, drives behavioral change, and establishes sustainable practices for a greener future.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-gray-600">
                      A sustainable Odisha where every community is empowered to take climate action, where
                      environmental stewardship is a way of life, and where future generations inherit a thriving, green
                      planet.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/join">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Mission
                </Button>
              </Link>
            </div>

            <div className="relative">
              <Image
                src="/about.png"
                alt="Earth Again Mission - Community working together"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 12-Year Vision */}
      {/* section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our 12-Year Vision for Odisha</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earth Again is not just a 60-day campaign—it's the beginning of a transformative 12-year journey toward a
              completely sustainable Odisha.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                year: "2024-2026",
                title: "Foundation Phase",
                description:
                  "Establish climate panchayats in all constituencies, create awareness, and build community networks.",
                icon: Users,
                color: "bg-green-100 text-green-600",
              },
              {
                year: "2027-2029",
                title: "Implementation Phase",
                description:
                  "Large-scale tree plantation, renewable energy adoption, and sustainable agriculture practices.",
                icon: TreePine,
                color: "bg-blue-100 text-blue-600",
              },
              {
                year: "2030-2032",
                title: "Innovation Phase",
                description:
                  "Technology integration, green infrastructure development, and climate-resilient communities.",
                icon: Lightbulb,
                color: "bg-orange-100 text-orange-600",
              },
              {
                year: "2033-2035",
                title: "Scaling Phase",
                description: "Expand successful models, create green jobs, and establish Odisha as a climate leader.",
                icon: Target,
                color: "bg-purple-100 text-purple-600",
              },
              {
                year: "2036-2038",
                title: "Consolidation Phase",
                description: "Strengthen achievements, ensure policy integration, and maintain momentum.",
                icon: Eye,
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                year: "2039-2041",
                title: "Legacy Phase",
                description: "Achieve carbon neutrality, complete ecosystem restoration, and inspire global action.",
                icon: Calendar,
                color: "bg-emerald-100 text-emerald-600",
              },
            ].map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${phase.color}`}>
                    <phase.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-gray-500 mb-2">{phase.year}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{phase.title}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Timeline */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#fefaf2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"><span className="text-green-600">60-Day</span> Movement Timeline</h2>
            <p className="text-xl text-gray-600">A carefully planned journey from awareness to action</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>

            <div className="space-y-12">
              {[
                {
                  date: "August 9-20",
                  title: "Launch & Awareness Phase",
                  description:
                    "Grand launch events, media campaigns, and initial climate panchayat formations across all constituencies.",
                  side: "left",
                },
                {
                  date: "August 21 - September 10",
                  title: "Community Mobilization",
                  description:
                    "Intensive workshop series, youth engagement programs, and volunteer recruitment drives.",
                  side: "right",
                },
                {
                  date: "September 11-30",
                  title: "Action Implementation",
                  description:
                    "Tree plantation drives, clean energy initiatives, and sustainable practice adoption campaigns.",
                  side: "left",
                },
                {
                  date: "October 1-10",
                  title: "Celebration & Commitment",
                  description: "Impact assessment, success celebrations, and long-term commitment ceremonies.",
                  side: "right",
                },
              ].map((phase, index) => (
                <div key={index} className={`flex items-center ${phase.side === "right" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-1/2 ${phase.side === "right" ? "pl-8" : "pr-8"}`}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-sm font-medium text-green-600 mb-2">{phase.date}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{phase.title}</h3>
                        <p className="text-gray-600">{phase.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <InstaFeed />
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of History</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in creating the largest grassroots environmental movement Odisha has ever seen. Your participation
            can change everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Register Now
              </Button>
            </Link>
            <Link href="/climate-panchayat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Host a Climate Panchayat
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
