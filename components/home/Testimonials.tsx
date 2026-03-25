'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO @ TechVentures', text: 'Planora transformed how we run our tech conferences. The real-time participant tracking is a game changer.', rating: 5, avatar: 'S', color: '#8B5CF6' },
  { name: 'Marcus Hill', role: 'Event Producer', text: 'I\'ve tried every platform out there. Planora\'s payment flow and approval system is the best by far.', rating: 5, avatar: 'M', color: '#22D3EE' },
  { name: 'Priya Nair', role: 'Community Manager', text: 'Our community grew 3x after switching to Planora. The private event system keeps our members engaged.', rating: 5, avatar: 'P', color: '#10B981' },
  { name: 'Alex Yamamoto', role: 'Startup Founder', text: 'Setup a paid conference in 10 minutes. Stripe integration is seamless. Our attendees love it.', rating: 5, avatar: 'A', color: '#F59E0B' },
  { name: 'Zoe Williams', role: 'UX Designer', text: 'Finally a platform that actually looks good. The dark mode is stunning and everything just works.', rating: 5, avatar: 'Z', color: '#EF4444' },
  { name: 'Omar Hassan', role: 'DevRel Engineer', text: 'The invitation system saved us hours of back-and-forth. Planora is simply the best event tool.', rating: 5, avatar: 'O', color: '#A78BFA' },
];

// Duplicate for infinite scroll
const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials.slice(3), ...testimonials.slice(3)];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-72 card p-5 mx-3">
      <div className="flex text-[var(--warning)] text-sm mb-3">{'★'.repeat(t.rating)}</div>
      <p className="text-[var(--text-2)] text-sm leading-relaxed mb-4">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: t.color }}>
          {t.avatar}
        </div>
        <div>
          <p className="text-[var(--text)] text-sm font-semibold">{t.name}</p>
          <p className="text-[var(--muted)] text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="divider absolute top-0 inset-x-0" />

      {/* Fades on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/25 text-[var(--success)] text-sm font-medium mb-5">
            ★ Testimonials
          </div>
          <h2 className="reveal font-display text-4xl sm:text-5xl font-bold text-[var(--text)] stagger-1">
            Loved by <span className="gradient-text">thousands</span>
          </h2>
          <p className="reveal text-[var(--muted)] mt-4 stagger-2">
            See why event creators and attendees choose Planora
          </p>
        </div>
      </div>

      {/* Row 1 — left */}
      <div className="flex overflow-hidden mb-4">
        <motion.div
          className="flex"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {row1.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </motion.div>
      </div>

      {/* Row 2 — right */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {row2.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </motion.div>
      </div>
    </section>
  );
}
