'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PaymentCard from '@/components/home/Paymentcards';




export default function ContactPage() {


  return (
    <>
      <Navbar />
      <main className='mt-10 w-full h-[100hv]'>
        <div className='w-full h-[100px] flex items-center justify-center'>
          <h1 className='text-3xl font-bold text-gray-800'></h1>
        </div>
        <PaymentCard />
      </main>
      <Footer />
    </>
  );
}
