import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';

export default function Home() {
  return (
    <div className='bg-white min-h-screen'>
      <Hero />
      <Navbar />
      <div className='min-h-[500vh]'></div>
    </div>
  );
}
