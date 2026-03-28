// ============================================================
// app/dashboard/page.tsx  →  payment=success query handler
// Save this as: app/payment/success/page.tsx
// ============================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    // Refresh user so plan status updates immediately
    fetchUser?.();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--success)] opacity-10 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* Success icon */}
            <div className="w-24 h-24 rounded-full bg-[var(--success)]/15 border-2 border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[var(--success)]" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Confetti emoji row */}
              <div className="flex justify-center gap-2 text-2xl mb-4">
                {['🎉', '✨', '🚀'].map((e, i) => (
                  <motion.span
                    key={e}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-3">
                You're on Pro!
              </h1>
              <p className="text-[var(--muted)] mb-8 leading-relaxed">
                Your subscription is now active. Unlock unlimited events, private events, advanced analytics, and priority support.
              </p>

              {/* Feature highlights */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-8 text-left space-y-3">
                {[
                  'Unlimited events created',
                  'Private & public events',
                  'Advanced analytics dashboard',
                  'Priority support',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <Sparkles className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" className="flex-1">
                  <button className="w-full py-3.5 rounded-xl font-bold text-sm gradient-bg text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/events/create" className="flex-1">
                  <button className="w-full py-3.5 rounded-xl font-bold text-sm border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors">
                    Create Event
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}