import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import Events from '@/components/home/UpcomingEvents';

export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <KeyFeatures />
      <Events />
    </>
  );
}
