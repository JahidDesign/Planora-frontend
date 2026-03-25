'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Users, ArrowRight, CheckCircle, Shield } from 'lucide-react';

const features = [
  'Create unlimited events', 'Built-in Stripe payments', 'Real-time notifications',
  'Private & public events', 'Participant approval flow', 'Reviews & ratings',
];

const partners = ['Google', 'Stripe', 'Vercel', 'AWS', 'GitHub', 'Figma', 'Notion', 'Slack'];

export default function CallToAction() {
  return (
    <>
      {/* Partner ticker */}
      <section className="py-12 relative overflow-hidden border-y border-[var(--border)]">
        <p className="text-center text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-6">
          Trusted by teams at
        </p>
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-16 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="flex-shrink-0 font-display font-bold text-xl text-[var(--muted-2)] hover:text-[var(--muted)] transition-colors">
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="divider absolute top-0 inset-x-0" />

        {/* Massive background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[var(--primary)] rounded-full blur-[140px]"
          />
        </div>

        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)] text-sm font-medium mb-8">
                  <Shield className="w-4 h-4" /> Start for Free Today
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text)] leading-[1.06]">
                  Ready to host your{' '}
                  <span className="gradient-text text-glow-p">next great event?</span>
                </h2>

                <p className="mt-6 text-[var(--muted)] text-lg leading-relaxed max-w-lg">
                  Join 10,000+ organizers who trust Planora to create meaningful experiences — 
                  from 5-person workshops to 5,000-seat conferences.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-2.5">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white gradient-bg glow-primary shadow-xl"
                    >
                      <Zap className="w-4 h-4" />
                      Create Your First Event
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link href="/events">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-[var(--text)] border-2 border-[var(--border-2)] hover:border-[var(--primary)]/50 transition-all"
                    >
                      <Users className="w-4 h-4" /> Browse Events
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right — floating UI mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16,1,0.3,1] }}
              className="hidden lg:block relative h-[440px]"
            >
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 card p-6 border-[var(--primary)]/25 border-2 overflow-hidden"
              >
                <div className="absolute inset-0 gradient-bg opacity-5" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-lg text-[var(--text)]">Next.js Summit 2025</h3>
                    <span className="badge badge-free">Free</span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface-2)] rounded-full mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '75%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      className="h-full gradient-bg rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-6">
                    <span>150 / 200 spots</span>
                    <span className="text-[var(--success)]">75% filled</span>
                  </div>

                  {/* Participant avatars */}
                  <div className="flex -space-x-2 mb-6">
                    {['#8B5CF6','#22D3EE','#10B981','#F59E0B','#EF4444'].map((c, i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: c }}>
                        {['A','B','C','D','E'][i]}
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-[var(--surface)] bg-[var(--surface-2)] flex items-center justify-center text-xs text-[var(--muted)]">
                      +145
                    </div>
                  </div>

                  {/* Live activity */}
                  <div className="space-y-2.5">
                    {['Alice just joined', 'Bob registered', 'New review: ★★★★★'].map((msg, i) => (
                      <motion.div
                        key={msg}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.2 }}
                        className="flex items-center gap-2.5 p-2.5 bg-[var(--surface-2)] rounded-xl text-xs text-[var(--muted)]"
                      >
                        <span className="live-dot !w-2 !h-2" />
                        {msg}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
