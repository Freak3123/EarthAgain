"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function JoinUsForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    contact: "",
    email: "",
    organisationName: "",
    organisationType: "",
    organisationLink: "",
    activity: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fefaf2] flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for joining us!</h1>
            <p className="text-xl text-gray-600 mb-8">
              We&apos;ll review your submission and get in touch shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fefaf2] pt-36 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl text-center">Join Us</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Details *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="demo@xyz.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisationName">Name Of The Organisation</Label>
                <Input
                  id="organisationName"
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  placeholder="Name Of The Organisation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisationType">Type Of Organisation</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, organisationType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select One From Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="community">Community Group</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisationLink">Any Link To Organisation</Label>
                <Input
                  id="organisationLink"
                  value={formData.organisationLink}
                  onChange={(e) => setFormData({ ...formData, organisationLink: e.target.value })}
                  placeholder="Website/Social media"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Brief Description Of Activity You Want To Do</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, activity: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select From Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plantation">Tree Plantation</SelectItem>
                    <SelectItem value="awareness">Awareness Campaign</SelectItem>
                    <SelectItem value="cleanliness">Cleanliness Drive</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                Join Us
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
