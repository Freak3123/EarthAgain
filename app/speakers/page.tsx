import { Button } from "@/components/ui/button";
import Link from "next/link";
import SpeakersSection from "@/components/home/SpeakersSections";

export default function SpeakersPage() {
  return (
    <div className="min-h-screen pt-12 bg-[#fefaf2]">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn from <span className="text-green-600">Experts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Join sessions with renowned environmental leaders, scientists, and
            activists who are shaping the future of sustainability and climate
            action.
          </p>
        </div>
      </section>

      <SpeakersSection />

      {/* Speaker Application */}
<section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Want to Speak at Earth Again?
    </h2>
    <p className="text-xl mb-8 opacity-90">
      Share your expertise and inspire thousands of participants. We
      welcome environmental experts, researchers, and practitioners to
      join our speaker lineup.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Apply to Speak → /join-us */}
      <Link href="/join-us">
        <Button
          size="lg"
          className="bg-white text-green-600 hover:bg-gray-100"
        >
          Apply to Speak
        </Button>
      </Link>

      {/* Contact Us → opens email */}
      <a href="mailto:eaoutreach2025@gmail.com">
        <Button
          size="lg"
          variant="outline"
          className="border-white text-white hover:bg-white/10 bg-transparent"
        >
          Contact Us
        </Button>
      </a>
    </div>
  </div>
</section>

    </div>
  );
}
