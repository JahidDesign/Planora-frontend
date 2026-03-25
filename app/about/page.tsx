'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/home/Aboutsection';



export default function AboutPage() {


  return (
    <>
      <Navbar />
      <main>
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
