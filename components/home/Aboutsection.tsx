'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, Globe, HeartHandshake, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useInView } from '@/hooks/useAnimations';

// Animated SVG wave divider
function WaveDivider() {
  return (
    <div className="absolute top-0 inset-x-0 overflow-hidden leading-none rotate-180">
      <svg
        className="relative block w-full h-16 text-[var(--bg)]"
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,32 C300,64 900,0 1200,32 L1200,64 L0,64 Z" />
      </svg>
    </div>
  );
}

// Orbiting ring background decoration
function OrbitRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[320, 520, 720].map((size, i) => (
        <motion.div
          key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border border-[var(--primary)]/10"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

const pillars = [
  {
    icon: Zap,
    title: 'Real-Time Everything',
    body: 'Live participant counts, instant ticket confirmations, and real-time notifications — so your audience feels the energy as it happens.',
    color: 'var(--primary)',
    delay: 0,
  },
  {
    icon: Shield,
    title: 'Trusted & Secure',
    body: 'End-to-end encrypted payments, fraud detection, and 99% uptime SLA mean you can focus on your event, not on infrastructure.',
    color: 'var(--accent)',
    delay: 80,
  },
  {
    icon: Globe,
    title: 'Globally Connected',
    body: 'Reach attendees in 120+ cities. Multi-currency support, localized notifications, and a CDN-backed platform built for the world.',
    color: 'var(--success)',
    delay: 160,
  },
  {
    icon: HeartHandshake,
    title: 'Community First',
    body: 'Organiser dashboards, attendee profiles, ratings, and follow features turn one-time events into lasting communities.',
    color: 'var(--warning)',
    delay: 240,
  },
];

const timeline = [
  { year: '2021', label: 'Founded', detail: 'Started with a single hackathon in a garage' },
  { year: '2022', label: '10 K Events', detail: 'Crossed the milestone in under 12 months' },
  { year: '2023', label: 'Global Expansion', detail: 'Launched in 40 countries with full localisation' },
  { year: '2024', label: 'Live Payments', detail: 'Real-time payout dashboard for organisers' },
  { year: '2025', label: 'AI Discovery', detail: 'Smart event recommendations powered by AI' },
];

// Single pillar card
function PillarCard({ icon: Icon, title, body, color, delay }: any) {
  const { ref, inView } = useInView(0.2);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="group card p-6 flex flex-col gap-4 hover:border-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="font-display font-bold text-lg text-[var(--text)] leading-snug">{title}</h3>
      <p className="text-[var(--muted)] text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

// Timeline step
function TimelineStep({ year, label, detail, index, total }: any) {
  const { ref, inView } = useInView(0.3);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex items-start gap-5"
    >
      {/* Line */}
      {index < total - 1 && (
        <div className="absolute left-[19px] top-10 w-px h-full bg-[var(--border)]" />
      )}

      {/* Dot */}
      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
      </div>

      {/* Content */}
      <div className="pb-8">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-display font-bold text-[var(--primary)] text-sm">{year}</span>
          <span className="font-bold text-[var(--text)]">{label}</span>
        </div>
        <p className="text-[var(--muted)] text-sm">{detail}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const { ref: missionRef, inView: missionInView } = useInView(0.2);

  return (
    <section id="about" className="relative overflow-hidden bg-[var(--surface)]">
      <WaveDivider />

      {/* Gradient orbs — match hero palette */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-[var(--primary)] blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-[var(--accent)] blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="pt-28 pb-16 text-center">
         

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-[var(--text)]">Built for the</span>
            <br />
            <span className="gradient-text text-glow-p">Future of Events</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-5 text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Planora was born from a simple frustration — great events were dying in spreadsheets
            and clunky forms. We set out to build the platform we always wished existed.
          </motion.p>
        </div>

        {/* ── Mission block ── */}
        <motion.div
          ref={missionRef as any}
          initial={{ opacity: 0, y: 30 }}
          animate={missionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative card overflow-hidden mb-20"
        >
          {/* Inner decorative ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
            <OrbitRings />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
            {/* Mission */}
            <div className="p-8 lg:p-12">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 flex items-center justify-center mb-5">
                <HeartHandshake className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[var(--text)] mb-3">Our Mission</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                To democratise live experiences — making it effortless for anyone, anywhere, to create
                meaningful gatherings that bring people together and spark lasting connections.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 lg:p-12">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center mb-5">
                <Code2 className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[var(--text)] mb-3">Our Vision</h3>
              <p className="text-[var(--muted)] leading-relaxed">
                A world where every idea finds its audience — where the gap between "I want to host an event"
                and "people are walking through the door" is measured in minutes, not months.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Four Pillars ── */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] text-center mb-10"
          >
            Why Planora?
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p) => (
              <PillarCard key={p.title} {...p} />
            ))}
          </div>
        </div>

        {/* ── Timeline + Team blurb ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-28">

          {/* Timeline */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] mb-10"
            >
              Our Journey
            </motion.h3>
            <div>
              {timeline.map((t, i) => (
                <TimelineStep key={t.year} {...t} index={i} total={timeline.length} />
              ))}
            </div>
          </div>

          {/* Team blurb with avatar grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="card p-8 lg:p-10 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/25 text-[var(--success)] text-xs font-medium w-fit">
              <span className="live-dot !bg-[var(--success)]" />
              Fully Remote Team
            </div>

            <h3 className="font-display font-bold text-2xl text-[var(--text)] leading-snug">
              60+ people building the<br />
              <span className="gradient-text">next generation</span> of events
            </h3>

            <p className="text-[var(--muted)] leading-relaxed">
              We're engineers, designers, and event obsessives spread across 18 countries. 
              Our diversity isn't a talking point — it's the reason Planora works for 
              organisers from Lagos to Los Angeles.
            </p>

            {/* Avatar mosaic */}
            <div className="grid grid-cols-8 gap-1.5">
              {[
                '#8B5CF6','#22D3EE','#10B981','#F59E0B','#EF4444',
                '#EC4899','#06B6D4','#84CC16','#F97316','#6366F1',
                '#14B8A6','#A855F7','#F43F5E','#0EA5E9','#22C55E','#EAB308',
              ].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: c }}
                >
                  {String.fromCharCode(65 + (i % 26))}
                </div>
              ))}
            </div>

            <Link href="/careers">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group mt-2 flex items-center gap-2 text-[var(--primary)] font-bold text-sm"
              >
                We're hiring — see open roles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative card overflow-hidden mb-20 text-center p-12 animate-border-glow"
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none" />

          <Sparkles className="w-8 h-8 text-[var(--primary)] mx-auto mb-4" />
          <h3 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] mb-3">
            Ready to create something{' '}
            <span className="gradient-text text-glow-p">unforgettable?</span>
          </h3>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-8">
            Join 10,000+ organisers who trust Planora to power their events. 
            Set up in minutes, go live today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white gradient-bg glow-primary shadow-lg"
              >
                <Zap className="w-4 h-4" />
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-[var(--primary)] border-2 border-[var(--primary)]/40 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors"
              >
                Browse Events
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Bottom gradient fade — same as hero */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </section>
  );
}