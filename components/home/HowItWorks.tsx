'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, CreditCard, PartyPopper } from 'lucide-react';

const steps = [
  {
    n: '01', icon: UserPlus, label: 'Create Account',
    desc: 'Sign up free in 30 seconds. No credit card required to get started.',
    color: 'from-[#8B5CF6] to-[#7C3AED]',
    glow: 'rgba(139,92,246,0.35)',
  },
  {
    n: '02', icon: Search, label: 'Discover Events',
    desc: 'Browse public events, filter by type and category, or get invited to private ones.',
    color: 'from-[#22D3EE] to-[#06B6D4]',
    glow: 'rgba(34,211,238,0.3)',
  },
  {
    n: '03', icon: CreditCard, label: 'Register & Pay',
    desc: 'Join free events instantly. Securely pay for premium events via Stripe.',
    color: 'from-[#10B981] to-[#059669]',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    n: '04', icon: PartyPopper, label: 'Experience & Review',
    desc: 'Attend your event, connect with people, and share your experience with reviews.',
    color: 'from-[#F59E0B] to-[#D97706]',
    glow: 'rgba(245,158,11,0.3)',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="divider absolute top-0 inset-x-0" />

      {/* Background decoration */}
      <div className="absolute inset-0 dot-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)] text-sm font-medium mb-5">
            How It Works
          </div>
          <h2 className="reveal font-display text-4xl sm:text-5xl font-bold text-[var(--text)] stagger-1">
            From zero to event in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="reveal text-[var(--muted)] mt-4 max-w-xl mx-auto stagger-2">
            Planora makes it ridiculously easy to create, discover, and attend events — all from one platform.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--success)] opacity-30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, icon: Icon, label, desc, color, glow }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16,1,0.3,1] }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="card p-6 h-full relative overflow-hidden"
                  style={{ '--hover-glow': glow } as any}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ boxShadow: `inset 0 0 40px ${glow}` }} />

                  {/* Step number */}
                  <div className="absolute top-4 right-4 font-mono text-5xl font-black text-[var(--border-2)] group-hover:text-[var(--border)] transition-colors duration-300 select-none leading-none">
                    {n}
                  </div>

                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}
                    style={{ boxShadow: `0 8px 24px ${glow}` }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-[var(--text)] mb-2">{label}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
