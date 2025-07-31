import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import Events from '@/components/home/UpcomingEvents';
import SpeakersSection from '@/components/home/SpeakersSection';
import Testimonials from '@/components/home/Testimonials';
import SponsorsPartners from '@/components/home/SponsorsPartners';
import InstaFeed from '@/components/home/InstaFeed';
import CallAction from '@/components/home/CallAction';

export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <KeyFeatures />
      <Events />
      <SpeakersSection />
      <Testimonials />
      <SponsorsPartners />
      <InstaFeed />
      {/* will make a map later */}
      <CallAction />
    </>
  );
}
