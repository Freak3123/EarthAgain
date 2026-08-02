"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { FormGate } from "@/components/FormGate"

export default function StartChapterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    socialLink: "",
    type: "",
    entityName: "",
    instituteName: "",
  })

  // Local entity chapters are named after the applicant unless they change it
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      entityName:
        value === "local-entity" && !prev.entityName ? prev.name : prev.entityName,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setIsSubmitted(true)
      } else {
        setError(data.message || "Something went wrong. Please try again.")
      }
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fefaf2] flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your chapter is on its way!</h1>
            <p className="text-xl text-gray-600 mb-8">
              We&apos;ll review your submission and get in touch shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <FormGate formKey="chapter">
    <div className="min-h-screen bg-[#fefaf2] pt-36 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl text-center">Start A Local Chapter</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name<span className="text-red-600">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number<span className="text-red-600">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email<span className="text-red-600">*</span></Label>
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialLink">Social Link<span className="text-red-600">*</span></Label>
                  <Input
                    id="socialLink"
                    value={formData.socialLink}
                    onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
                    placeholder="Instagram/LinkedIn/Facebook profile"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type Of Chapter<span className="text-red-600">*</span></Label>
                <Select value={formData.type} onValueChange={handleTypeChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select One From Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local-entity">Local Entity</SelectItem>
                    <SelectItem value="college-chapter">College Chapter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "local-entity" && (
                <div className="space-y-2">
                  <Label htmlFor="entityName">Name Of The Entity<span className="text-red-600">*</span></Label>
                  <Input
                    id="entityName"
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder="Name Of The Entity"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Defaults to your name — change it if your chapter goes by something else.
                  </p>
                </div>
              )}

              {formData.type === "college-chapter" && (
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Name Of The Institute<span className="text-red-600">*</span></Label>
                  <Input
                    id="instituteName"
                    value={formData.instituteName}
                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                    placeholder="Name Of Your College/University"
                    required
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Start My Chapter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </FormGate>
  )
}
