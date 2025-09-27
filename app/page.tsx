import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import KeyFeatures from '@/components/home/KeyFeatures';
import ImpactTracker from '@/components/home/ImpactTracker';
import Events from '@/components/home/UpcomingEvents';
import SpeakersSection from '@/components/home/SpeakerSection';
import Testimonials from '@/components/home/Testimonials';
import SponsorsPartners from '@/components/home/SponsorsPartners';
import CallAction from '@/components/home/CallAction';
import EditorsMessage from '@/components/home/EditorsMessage';

export default function Home() {
  return (
    <div className='min-w-sw'>
      <Hero />
      <Navbar />
      <EditorsMessage
        name="Tanaya Patnaik"
        title="Editor, Sambad Group"
        avatarSrc="/maam.jpg" 
        message={`As Editor of Sambad Group, Odisha’s leading media house with print, TV, radio, and digital wings, I am proud to share with you  our most ambitious initiative: the “Punascha Pruthibi” (Earth Again) campaign.
This transformative 12-year journey (2024-2036) represents our comprehensive commitment to climate action through 360-degree promotion and communication.
Our mission encompasses climate panchayats to educate leaders, training dedicated climate journalists, hosting annual Earth Again conferences, and ensuring 365 days of continuous climate action. Through our integrated media platforms, we will reach every corner of Odisha—from urban centers to remote villages.
Our ultimate goal: creating a climate warrior in every household of Odisha.
Climate change affects our farmers, coastal communities, and forests today. Together, we have the power to transform Odisha into a beacon of hope in the global fight against climate change.
Join us in making the earth whole again.
`}
      />
      <KeyFeatures />
      <SponsorsPartners />
      <ImpactTracker /> 
      
     
      <SpeakersSection />
      {/* <Testimonials /> */}
      <Events />
      {/* will make a map later */}
      <CallAction />
    </div>
  );
}
