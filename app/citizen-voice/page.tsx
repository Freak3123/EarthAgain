"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, Users, MapPin, TrendingUp, CheckCircle, BarChart3, Waves, Sun, TreePine, Droplets, Wind, Mountain, Fish } from "lucide-react"
import BarPoll from "@/components/ui/barpoll"
import Link from "next/link"


export default function EnvironmentalIssuesPage() {
  const [activeTab, setActiveTab] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    district: "",
    issues: [] as string[],
  })
  const [overTab, setOverTab] = useState(false);



  const environmentalIssues = [
    {
      id: "cyclones",
      odia: "ବାରମ୍ବାର ଘୂର୍ଣ୍ଣିବଳୟ",
      english: "Frequent Cyclones",
      icon: Wind,
      color: "text-blue-600",
      description: "Recurring tropical cyclones causing widespread damage"
    },
    {
      id: "drought",
      odia: "ମରୁଡ଼ି",
      english: "Drought",
      icon: Sun,
      color: "text-orange-600",
      description: "Water scarcity and agricultural challenges"
    },
    {
      id: "mangroves",
      odia: "ହେନ୍ତାଳବଣ ଅବକ୍ଷୟ",
      english: "Mangroves Degradation",
      icon: TreePine,
      color: "text-green-600",
      description: "Loss of coastal mangrove ecosystems"
    },
    {
      id: "flooding",
      odia: "ସହରୀ ବନ୍ୟା",
      english: "Urban Flooding",
      icon: Droplets,
      color: "text-blue-500",
      description: "Waterlogging in urban areas during monsoons"
    },
    {
      id: "heating",
      odia: "ଅତ୍ୟଧିକ ଗ୍ରୀଷ୍ମ ପ୍ରବାହ",
      english: "Urban Heating",
      icon: Sun,
      color: "text-red-600",
      description: "Rising temperatures in urban areas"
    },
    {
      id: "biodiversity",
      odia: "ଜୈବ ବିବିଧତାର କ୍ଷତି",
      english: "Biodiversity Loss",
      icon: Fish,
      color: "text-purple-600",
      description: "Decline in flora and fauna diversity"
    },
    {
      id: "sealevel",
      odia: "ସମୁଦ୍ର ସ୍ତରର ବୃଦ୍ଧି",
      english: "Rising Sea Level",
      icon: Waves,
      color: "text-teal-600",
      description: "Coastal erosion and saltwater intrusion"
    }
  ]

  // Mock data for results
  const voteResults = [
    { issue: "cyclones", votes: 1247, percentage: 23.4, color: "bg-blue-600" },
    { issue: "drought", votes: 1156, percentage: 21.7, color: "bg-orange-600" },
    { issue: "flooding", votes: 987, percentage: 18.5, color: "bg-blue-500" },
    { issue: "biodiversity", votes: 743, percentage: 13.9, color: "bg-purple-600" },
    { issue: "heating", votes: 654, percentage: 12.3, color: "bg-red-600" },
    { issue: "mangroves", votes: 432, percentage: 8.1, color: "bg-pink-600" },
    { issue: "sealevel", votes: 112, percentage: 2.1, color: "bg-teal-600" },
  ]

  const districtResults = [
    { district: "Puri", topIssue: "cyclones", votes: 234 },
    { district: "Cuttack", topIssue: "flooding", votes: 198 },
    { district: "Khordha", topIssue: "heating", votes: 187 },
    { district: "Ganjam", topIssue: "drought", votes: 165 },
    { district: "Balasore", topIssue: "cyclones", votes: 143 },
  ]


  // const handleIssueChange = (issueId: string, checked: boolean) => {
  //   if (checked) {
  //     if (formData.issues.length < 5) {
  //       setFormData(prev => ({
  //         ...prev,
  //         issues: [...prev.issues, issueId]
  //       }))
  //     }
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       issues: prev.issues.filter(id => id !== issueId)
  //     }))
  //   }
  // }

  const getIssueDetails = (issueId: string) => {
    return environmentalIssues.find(issue => issue.id === issueId)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fefaf2] flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ଧନ୍ୟବାଦ! Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your vote has been recorded successfully. Together, we&apos;ll address these critical environmental challenges facing Odisha.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setIsSubmitted(false)
                  setActiveTab("results")
                }}
              >
                View Results
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ name: "", email: "", mobile: "", district: "", issues: [] })
                  setActiveTab("vote")
                }}
              >
                Submit Another Vote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-12 bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-6">
            <Vote className="w-4 h-4 mr-2" />
            Environmental Issues Survey
          </Badge> */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Share with us the top 5 <span className="text-green-600">Environment Issues</span> of your district
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-gray-600">
              Citizens play a vital role in acknowledging, understanding and acting on the issues caused by Climate Change. 
              Today Odisha is in the forefront of major climate change related issues.
            </p>
            <p className="text-lg text-gray-700 font-medium">
              As responsible citizens and people of this beautiful planet, let us unite to solve this together. 
              <span className="text-green-600"> Let us come together today for tomorrow!</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="submit-the-vote" className="py-16 px-4 md:px-6 lg:px-8" onClick={() => { if (!overTab) setActiveTab("")}} >

        <BarPoll initialVotes={voteResults} />
 
        <div className="max-w-6xl w-full mx-auto" >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger onMouseOver={()=>{setOverTab(true)}} onMouseLeave={()=>{setOverTab(false)}} value="results" className="text-lg py-3">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Results
              </TabsTrigger>
              <TabsTrigger onMouseOver={()=>{setOverTab(true)}} onMouseLeave={()=>{setOverTab(false)}} value="districts" className="text-lg py-3">
                <MapPin className="w-5 h-5 mr-2" />
                District Analysis
              </TabsTrigger>
            </TabsList>



            <TabsContent value="results">
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      Overall Results - Top Environmental Issues in Odisha
                    </CardTitle>
                    <p className="text-gray-600">Based on {voteResults.reduce((sum, result) => sum + result.votes, 0)} votes from citizens across Odisha</p>
                  </CardHeader>

                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Wind className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Cyclones are the #1 concern</p>
                            <p className="text-sm text-gray-600">Affecting coastal districts most</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <Sun className="w-6 h-6 text-orange-600" />
                          <div>
                            <p className="font-medium text-gray-900">Drought impacts agriculture</p>
                            <p className="text-sm text-gray-600">Western districts most affected</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Droplets className="w-6 h-6 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Urban flooding rising</p>
                            <p className="text-sm text-gray-600">Major cities need attention</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Participation Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">5,331</div>
                          <div className="text-sm text-gray-600">Total Votes</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">30</div>
                            <div className="text-xs text-gray-600">Districts</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">2,847</div>
                            <div className="text-xs text-gray-600">Citizens</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="districts">
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-green-600" />
                      District-wise Analysis
                    </CardTitle>
                    <p className="text-gray-600">Top environmental concerns by district</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {districtResults.map((district, index) => {
                        const issue = getIssueDetails(district.topIssue)
                        if (!issue) return null

                        return (
                          <Card key={district.district} className="border border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">{district.district}</h3>
                                <Badge className="bg-green-100 text-green-800">#{index + 1}</Badge>
                              </div>
                              
                              <div className="flex items-center gap-3 mb-3">
                                <issue.icon className={`w-6 h-6 ${issue.color}`} />
                                <div>
                                  <p className="font-medium text-gray-900">{issue.english}</p>
                                  <p className="text-sm text-gray-600">{issue.odia}</p>
                                </div>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                <strong>{district.votes} votes</strong> - Top concern
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Regional Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Waves className="w-5 h-5 text-blue-600" />
                          Coastal Districts
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Cyclones</span>
                            <span className="font-medium">67%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sea Level Rise</span>
                            <span className="font-medium">23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mangrove Loss</span>
                            <span className="font-medium">45%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Mountain className="w-5 h-5 text-green-600" />
                          Interior Districts
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Drought</span>
                            <span className="font-medium">58%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Biodiversity Loss</span>
                            <span className="font-medium">34%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Urban Heating</span>
                            <span className="font-medium">29%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          Urban Areas
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Urban Flooding</span>
                            <span className="font-medium">72%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Urban Heating</span>
                            <span className="font-medium">56%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Biodiversity Loss</span>
                            <span className="font-medium">41%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
      
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Voice Matters</h2>
          <p className="text-xl mb-8 opacity-90">
            Every vote helps us understand and prioritize the environmental challenges facing Odisha. 
            Together, we can create targeted solutions for each district&apos;s unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#submit-the-vote" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => {
                if (!isSubmitted) {
                  setActiveTab("vote")
                }
              }}
            >
              <Vote className="w-5 h-5 mr-2" />
              Submit Your Vote
            </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => setActiveTab("results")}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Results
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
