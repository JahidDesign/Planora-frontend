'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';


export default function HomePage() {

  return (
    <>
      <Navbar />
      <main>
        <SubscriptionCard />
      </main>
      <Footer />
    </>
  );
}
