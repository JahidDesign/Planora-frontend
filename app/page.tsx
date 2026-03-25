'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import UpcomingEventsSlider from '@/components/home/UpcomingEventsSlider';
import EventCategories from '@/components/home/EventCategories';
import Testimonials from '@/components/home/Testimonials';
import Pricing from '@/components/home/Pricing';
import CallToAction from '@/components/home/CallToAction';
import { useScrollReveal } from '@/hooks/useAnimations';

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <UpcomingEventsSlider />
        <EventCategories />
        <Testimonials />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
