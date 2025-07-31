import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { KeyFeatures } from '@/components/home/KeyFeatures';

export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <KeyFeatures />
    </>
  );
}
