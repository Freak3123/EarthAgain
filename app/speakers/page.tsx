import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, BookOpen } from "lucide-react"
import Image from "next/image"

export default function SpeakersPage() {
  const speakers = [
    {
      id: 1,
      name: "Dr. Vandana Shiva",
      designation: "Environmental Activist & Author",
      bio: "World-renowned environmental activist, food sovereignty advocate, and author of over 20 books on environmental and social justice.",
      session: "Keynote: Seeds of Change - Biodiversity and Climate Resilience",
      date: "August 10, 2024",
      expertise: ["Biodiversity", "Sustainable Agriculture", "Environmental Justice"],
      achievements: ["Right Livelihood Award", "Sydney Peace Prize", "Fukuoka Prize"],
      image: "Dr Vandana Shiva speaking at environmental conference",
      featured: true,
    },
    {
      id: 2,
      name: "Sunita Narain",
      designation: "Director, Centre for Science and Environment",
      bio: "Leading environmentalist and political activist, known for her work on water management and environmental policy in India.",
      session: "Climate Policy and Community Action",
      date: "August 15, 2024",
      expertise: ["Environmental Policy", "Water Management", "Climate Change"],
      achievements: ["Padma Shri", "Stockholm Water Prize", "Champions of the Earth"],
      image: "Sunita Narain at environmental policy discussion",
    },
    {
      id: 3,
      name: "Dr. Raghunath Anant Mashelkar",
      designation: "Former Director General, CSIR",
      bio: "Renowned scientist and innovation expert, advocate for inclusive innovation and sustainable development.",
      session: "Innovation for Climate Solutions",
      date: "August 20, 2024",
      expertise: ["Scientific Innovation", "Sustainable Technology", "Research & Development"],
      achievements: ["Padma Vibhushan", "Fellow of Royal Society", "UNESCO Science Prize"],
      image: "Dr Mashelkar presenting scientific innovation",
    },
    {
      id: 4,
      name: "Kailash Satyarthi",
      designation: "Nobel Peace Prize Laureate",
      bio: "Child rights activist and Nobel laureate, working on sustainable development and social justice.",
      session: "Youth Leadership in Climate Action",
      date: "August 25, 2024",
      expertise: ["Youth Empowerment", "Social Justice", "Sustainable Development"],
      achievements: ["Nobel Peace Prize", "Ramon Magsaysay Award", "Harvard Humanitarian Award"],
      image: "Kailash Satyarthi with youth climate activists",
    },
    {
      id: 5,
      name: "Dr. Soumya Swaminathan",
      designation: "Former Chief Scientist, WHO",
      bio: "Global health expert focusing on the intersection of climate change and public health.",
      session: "Climate Change and Public Health",
      date: "September 2, 2024",
      expertise: ["Public Health", "Climate Health", "Global Health Policy"],
      achievements: ["Padma Shri", "WHO Leadership", "Global Health Recognition"],
      image: "Dr Soumya Swaminathan at health climate summit",
    },
    {
      id: 6,
      name: "Aruna Roy",
      designation: "Social Activist & RTI Pioneer",
      bio: "Renowned social activist and transparency advocate, working on grassroots democracy and environmental governance.",
      session: "Transparency in Environmental Governance",
      date: "September 8, 2024",
      expertise: ["Social Activism", "Transparency", "Grassroots Democracy"],
      achievements: ["Ramon Magsaysay Award", "RTI Act Pioneer", "Social Justice Champion"],
      image: "Aruna Roy speaking about environmental governance",
    },
  ]

  const featuredSpeaker = speakers.find((speaker) => speaker.featured)!
  const otherSpeakers = speakers.filter((speaker) => !speaker.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">Guest Speakers</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn from <span className="text-green-600">Experts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Join sessions with renowned environmental leaders, scientists, and activists who are shaping the future of
            sustainability and climate action.
          </p>
        </div>
      </section>

      {/* Featured Speaker */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Keynote Speaker</h2>
          </div>

          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-96 lg:h-auto">
                <Image
                  src={`/placeholder.svg?height=500&width=600&query=${featuredSpeaker.image}`}
                  alt={featuredSpeaker.name}
                  width={600}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-green-600 text-white">Keynote Speaker</Badge>
                </div>
              </div>
              <CardContent className="p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{featuredSpeaker.name}</h3>
                <p className="text-xl text-green-600 font-medium mb-6">{featuredSpeaker.designation}</p>

                <p className="text-lg text-gray-600 mb-8">{featuredSpeaker.bio}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{featuredSpeaker.session}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>{featuredSpeaker.date}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Expertise Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredSpeaker.expertise.map((area, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                  <div className="space-y-2">
                    {featuredSpeaker.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Register for Session
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* All Speakers */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">All Speakers</h2>
            <p className="text-xl text-gray-600">Meet the experts who will guide our sustainability journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherSpeakers.map((speaker) => (
              <Card key={speaker.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{speaker.bio}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="line-clamp-1">{speaker.session}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{speaker.date}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {speaker.expertise.slice(0, 2).map((area, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                          {area}
                        </Badge>
                      ))}
                      {speaker.expertise.length > 2 && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          +{speaker.expertise.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker Application */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Speak at Earth Again?</h2>
          <p className="text-xl mb-8 opacity-90">
            Share your expertise and inspire thousands of participants. We welcome environmental experts, researchers,
            and practitioners to join our speaker lineup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Apply to Speak
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Nominate a Speaker
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
