'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Building2 } from 'lucide-react';

const plans = [
  {
    name: 'Free', icon: Zap, price: 0, period: 'forever',
    desc: 'Perfect for getting started',
    color: 'border-[var(--border)]',
    btnClass: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10',
    features: [
      'Up to 3 active events',
      'Public events only',
      'Up to 50 participants',
      'Basic analytics',
      'Email notifications',
    ],
    href: '/auth/register',
    cta: 'Start Free',
  },
  {
    name: 'Pro', icon: Star, price: 29, period: 'month',
    desc: 'For serious event creators',
    color: 'border-[var(--primary)] animate-border-glow',
    featured: true,
    btnClass: 'text-white gradient-bg glow-primary hover:opacity-90',
    badge: 'Most Popular',
    features: [
      'Unlimited events',
      'Public & private events',
      'Unlimited participants',
      'Stripe payment integration',
      'Advanced analytics',
      'Custom invitations',
      'Priority support',
    ],
    href: '/auth/register',
    cta: 'Start Pro Trial',
  },
  {
    name: 'Enterprise', icon: Building2, price: 99, period: 'month',
    desc: 'For large organizations',
    color: 'border-[var(--border)]',
    btnClass: 'border border-[var(--border-2)] text-[var(--text)] hover:border-[var(--primary)]/50',
    features: [
      'Everything in Pro',
      'Custom domain',
      'SSO & SAML',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'White-label options',
    ],
    href: '/contact',
    cta: 'Contact Sales',
  },
];

export default function Pricing() {
  return (
    <section className="py-28 relative overflow-hidden" id="pricing">
      <div className="divider absolute top-0 inset-x-0" />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--primary)] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-sm font-medium mb-5">
            Pricing
          </div>
          <h2 className="reveal font-display text-4xl sm:text-5xl font-bold text-[var(--text)] stagger-1">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="reveal text-[var(--muted)] mt-4 stagger-2">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ name, icon: Icon, price, period, desc, color, featured, btnClass, badge, features, href, cta }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16,1,0.3,1] }}
              className={`relative card p-8 border-2 ${color} ${featured ? 'scale-105' : ''}`}
            >
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-bold rounded-full gradient-bg shadow-lg">
                  {badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${featured ? 'gradient-bg text-white' : 'bg-[var(--surface-2)] text-[var(--primary)]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-[var(--text)]">{name}</p>
                  <p className="text-[var(--muted)] text-xs">{desc}</p>
                </div>
              </div>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="font-display font-black text-5xl text-[var(--text)]">${price}</span>
                  <span className="text-[var(--muted)] text-sm mb-2">/{period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                    <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={href}>
                <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${btnClass}`}>
                  {cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
