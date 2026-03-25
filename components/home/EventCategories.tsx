'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Lock, Tag, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'public-free',
    label: 'Public Free',
    sub: 'Open to everyone',
    icon: Globe,
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    params: { type: 'PUBLIC', fee: 'free' },
    pill: '🌍 Free',
    pillStyle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    count: '6,200+',
  },
  {
    id: 'public-paid',
    label: 'Public Paid',
    sub: 'Premium public events',
    icon: Tag,
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'hover:border-amber-500/40',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    params: { type: 'PUBLIC', fee: 'paid' },
    pill: '💳 Paid',
    pillStyle: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    count: '2,800+',
  },
  {
    id: 'private-free',
    label: 'Private Free',
    sub: 'Invite-only, no fee',
    icon: Lock,
    gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
    border: 'hover:border-violet-500/40',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    params: { type: 'PRIVATE', fee: 'free' },
    pill: '🔒 Exclusive',
    pillStyle: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    count: '900+',
  },
  {
    id: 'private-paid',
    label: 'Private Paid',
    sub: 'VIP access events',
    icon: Lock,
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    border: 'hover:border-cyan-500/40',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    params: { type: 'PRIVATE', fee: 'paid' },
    pill: '⭐ VIP',
    pillStyle: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    count: '420+',
  },
];

export default function EventCategories() {
  const router = useRouter();

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="divider absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-sm font-medium mb-5">
            Browse By Type
          </div>
          <h2 className="reveal font-display text-4xl sm:text-5xl font-bold text-[var(--text)] stagger-1">
            Find Your <span className="gradient-text">Perfect Event</span>
          </h2>
          <p className="reveal text-[var(--muted)] mt-4 max-w-xl mx-auto stagger-2">
            From free community meetups to exclusive VIP experiences — every type of event is here.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map(({ id, label, sub, icon: Icon, gradient, border, iconBg, iconColor, params, pill, pillStyle, count }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              onClick={() => router.push(`/events?${new URLSearchParams(params)}`)}
              className={`group relative cursor-pointer rounded-2xl border border-[var(--border)] ${border} overflow-hidden transition-all duration-300 bg-[var(--surface)]`}
            >
              {/* Gradient fill */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative p-6">
                {/* Icon + pill row */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pillStyle}`}>{pill}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-[var(--text)] mb-1">{label}</h3>
                <p className="text-[var(--muted)] text-sm mb-5">{sub}</p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-2)] font-mono">{count} events</span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] group-hover:bg-[var(--surface-3)] flex items-center justify-center transition-colors">
                    <ArrowUpRight className={`w-4 h-4 ${iconColor} group-hover:scale-110 transition-transform`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
