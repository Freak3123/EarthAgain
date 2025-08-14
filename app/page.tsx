import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import ImpactTracker from '@/components/home/ImpactTracker';
import Events from '@/components/home/UpcomingEvents';
import SpeakersSection from '@/components/home/SpeakersSection';
import Testimonials from '@/components/home/Testimonials';
import SponsorsPartners from '@/components/home/SponsorsPartners';
import CallAction from '@/components/home/CallAction';

export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <KeyFeatures />
      <ImpactTracker />
      {/* <Events /> */}
      <SpeakersSection />
      {/* <Testimonials /> */}
      {/* <SponsorsPartners /> */}
      {/* will make a map later */}
      <CallAction />
    </>
  );
}
