// Save as: app/payment/cancelled/page.tsx

'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function PaymentCancelledPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--error)] opacity-10 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="w-24 h-24 rounded-full bg-[var(--error)]/15 border-2 border-[var(--error)]/30 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-[var(--error)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-3">
              Payment Cancelled
            </h1>
            <p className="text-[var(--muted)] mb-8 leading-relaxed">
              No worries — you haven't been charged. You can try again anytime or continue with the free plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/#pricing" className="flex-1">
                <button className="w-full py-3.5 rounded-xl font-bold text-sm gradient-bg text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <button className="w-full py-3.5 rounded-xl font-bold text-sm border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}