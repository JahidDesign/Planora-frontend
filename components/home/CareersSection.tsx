'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  Zap,
  Heart,
  Coffee,
  Laptop,
  TrendingUp,
  Users,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useInView } from '@/hooks/useAnimations';

// ── Types ──────────────────────────────────────────────────────────────────
interface Role {
  title: string;
  team: string;
  location: string;
  type: string;
  tag: string;
  tagColor: string;
  slug: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const roles: Role[] = [
  {
    title: 'Senior Backend Engineer',
    team: 'Platform',
    location: 'Remote (EU / US)',
    type: 'Full-time',
    tag: 'Engineering',
    tagColor: 'var(--primary)',
    slug: 'senior-backend-engineer',
  },
  {
    title: 'Product Designer',
    team: 'Design',
    location: 'Remote (Global)',
    type: 'Full-time',
    tag: 'Design',
    tagColor: 'var(--accent)',
    slug: 'product-designer',
  },
  {
    title: 'Growth Marketing Manager',
    team: 'Marketing',
    location: 'Remote (US)',
    type: 'Full-time',
    tag: 'Marketing',
    tagColor: 'var(--success)',
    slug: 'growth-marketing-manager',
  },
  {
    title: 'iOS Engineer',
    team: 'Mobile',
    location: 'Remote (Global)',
    type: 'Full-time',
    tag: 'Engineering',
    tagColor: 'var(--primary)',
    slug: 'ios-engineer',
  },
  {
    title: 'Customer Success Lead',
    team: 'CX',
    location: 'Remote (APAC)',
    type: 'Full-time',
    tag: 'Operations',
    tagColor: 'var(--warning)',
    slug: 'customer-success-lead',
  },
  {
    title: 'Data Analyst',
    team: 'Analytics',
    location: 'Remote (Global)',
    type: 'Contract',
    tag: 'Analytics',
    tagColor: 'var(--accent)',
    slug: 'data-analyst',
  },
];

const perks = [
  {
    icon: Globe,
    title: 'Work from Anywhere',
    body: 'Fully remote-first culture. We care about outcomes, not office hours.',
    color: 'var(--primary)',
  },
  {
    icon: TrendingUp,
    title: 'Equity for Everyone',
    body: 'Meaningful stock options from day one. When Planora wins, you win.',
    color: 'var(--accent)',
  },
  {
    icon: Coffee,
    title: '$2K Workspace Budget',
    body: 'Set up your perfect home office. We cover the gear, you bring the focus.',
    color: 'var(--success)',
  },
  {
    icon: Heart,
    title: 'Full Health Coverage',
    body: 'Medical, dental, and vision covered at 100% for you and your family.',
    color: 'var(--warning)',
  },
  {
    icon: Laptop,
    title: 'Latest Gear, Always',
    body: 'Top-spec laptop on day one. Refresh every two years, no questions asked.',
    color: 'var(--primary)',
  },
  {
    icon: Users,
    title: 'Annual Team Retreats',
    body: 'We fly the whole company together once a year — somewhere worth the trip.',
    color: 'var(--accent)',
  },
];

const values = [
  { emoji: '🚀', title: 'Move Fast, Break Thoughtfully', body: 'Speed matters, but not at the cost of our users.' },
  { emoji: '🌍', title: 'Default to Async', body: 'Your timezone is never a disadvantage here.' },
  { emoji: '🔍', title: 'Radical Transparency', body: 'Open metrics, open roadmap, open salary bands.' },
  { emoji: '🤝', title: 'Own Your Work', body: 'Autonomy and accountability go hand in hand.' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

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

function PerkCard({
  icon: Icon,
  title,
  body,
  color,
  delay,
}: {
  icon: any;
  title: string;
  body: string;
  color: string;
  delay: number;
}) {
  const { ref, inView } = useInView(0.15);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="group card p-6 flex flex-col gap-4 hover:border-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="font-display font-bold text-base text-[var(--text)]">{title}</h3>
      <p className="text-[var(--muted)] text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/careers/${role.slug}`}>
        <div className="group card p-5 flex items-center justify-between gap-4 hover:border-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Tag */}
            <span
              className="text-[10px] font-bold uppercase tracking-widest w-fit px-2 py-0.5 rounded-full"
              style={{
                color: role.tagColor,
                background: `${role.tagColor}18`,
              }}
            >
              {role.tag}
            </span>

            {/* Title */}
            <h3 className="font-display font-bold text-[var(--text)] text-base leading-snug group-hover:text-[var(--primary)] transition-colors">
              {role.title}
            </h3>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {role.team}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {role.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {role.type}
              </span>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

function ValuePill({
  emoji,
  title,
  body,
  index,
}: {
  emoji: string;
  title: string;
  body: string;
  index: number;
}) {
  const { ref, inView } = useInView(0.2);
  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="card p-5 flex items-start gap-4"
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="font-display font-bold text-[var(--text)] text-sm mb-0.5">{title}</p>
        <p className="text-[var(--muted)] text-xs leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function CareersSection() {
  return (
    <section id="careers" className="relative overflow-hidden bg-[var(--surface)]">
      <WaveDivider />

      {/* Ambient glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-[var(--primary)] blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.06, 0.11, 0.06] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-[var(--accent)] blur-[110px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="pt-28 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-xs font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            We're hiring across 18 countries
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-[var(--text)]">Help us shape</span>
            <br />
            <span className="gradient-text text-glow-p">the future of events</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-5 text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto"
          >
            We're a fully-remote team of builders obsessed with live experiences.
            If you want your work to reach millions of event-goers worldwide, you're in the right place.
          </motion.p>
        </div>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card p-6 mb-20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: '60+', label: 'Team members' },
            { value: '18', label: 'Countries' },
            { value: '4.9★', label: 'Glassdoor rating' },
            { value: '0%', label: 'Office mandate' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-display font-bold text-3xl gradient-text">{value}</span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Values ── */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] text-center mb-10"
          >
            How we work
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <ValuePill key={v.title} {...v} index={i} />
            ))}
          </div>
        </div>

        {/* ── Perks ── */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] text-center mb-10"
          >
            The good stuff
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((p, i) => (
              <PerkCard key={p.title} {...p} delay={i * 70} />
            ))}
          </div>
        </div>

        {/* ── Open Roles ── */}
        <div className="mb-28">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)]"
            >
              Open roles
            </motion.h3>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 rounded-full"
            >
              {roles.length} positions available
            </motion.span>
          </div>

          <div className="flex flex-col gap-3">
            {roles.map((role, i) => (
              <RoleCard key={role.slug} role={role} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-[var(--muted)] text-sm">
              Don't see your role?{' '}
              <Link
                href="mailto:careers@planora.com"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                Send us an open application →
              </Link>
            </p>
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
          <div className="absolute inset-0 gradient-bg opacity-10 pointer-events-none" />

          <Zap className="w-8 h-8 text-[var(--primary)] mx-auto mb-4" />
          <h3 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)] mb-3">
            Build something{' '}
            <span className="gradient-text text-glow-p">you're proud of</span>
          </h3>
          <p className="text-[var(--muted)] max-w-lg mx-auto mb-8">
            Real ownership, async-first culture, and a product that millions of people use every day.
            Come shape what events look like for the next decade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#open-roles">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white gradient-bg glow-primary shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                View Open Roles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-[var(--primary)] border-2 border-[var(--primary)]/40 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors"
              >
                Learn About Us
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </section>
  );
}