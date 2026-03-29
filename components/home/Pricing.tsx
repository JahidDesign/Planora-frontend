'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Zap,
  Star,
  Building2,
  Loader2,
  Sparkles,
  ArrowRight,
  Shield,
  LucideIcon,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ── Stripe ─────────────────────────────────────────────────────────────────
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── Types ──────────────────────────────────────────────────────────────────
interface Plan {
  name: string;
  icon: LucideIcon;
  monthlyPrice: number;
  yearlyPrice: number;
  period: string;
  desc: string;
  borderClass: string;
  btnClass: string;
  iconClass: string;
  features: string[];
  href: string | null;
  cta: string;
  priceId: string | null | undefined;
  yearlyPriceId: string | null | undefined;
  featured: boolean;
  badge?: string;
  accentColor: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const plans: Plan[] = [
  {
    name: 'Free',
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: 'forever',
    desc: 'Perfect for getting started',
    accentColor: 'var(--success)',
    borderClass: 'border-[var(--border)]',
    iconClass: 'bg-[var(--success)]/10 text-[var(--success)]',
    btnClass:
      'border-2 border-[var(--primary)]/40 text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10',
    features: [
      'Up to 3 active events',
      'Public events only',
      'Up to 50 participants',
      'Basic analytics',
      'Email notifications',
    ],
    href: '/auth/register',
    cta: 'Start Free',
    priceId: null,
    yearlyPriceId: null,
    featured: false,
  },
  {
    name: 'Pro',
    icon: Star,
    monthlyPrice: 29,
    yearlyPrice: 19,
    period: 'month',
    desc: 'For serious event creators',
    accentColor: 'var(--primary)',
    borderClass: 'border-[var(--primary)]/60',
    iconClass: 'gradient-bg text-white',
    btnClass: 'text-white gradient-bg glow-primary hover:opacity-90',
    features: [
      'Unlimited events',
      'Public & private events',
      'Unlimited participants',
      'Stripe payment integration',
      'Advanced analytics',
      'Custom invitations',
      'Priority support',
    ],
    href: null,
    cta: 'Start Pro Trial',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    monthlyPrice: 99,
    yearlyPrice: 79,
    period: 'month',
    desc: 'For large organizations',
    accentColor: 'var(--accent)',
    borderClass: 'border-[var(--border)]',
    iconClass: 'bg-[var(--accent)]/10 text-[var(--accent)]',
    btnClass:
      'border-2 border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)]',
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
    priceId: null,
    yearlyPriceId: null,
    featured: false,
  },
];

const trustBadges = [
  'No credit card required for Free',
  'Cancel anytime',
  'Secured by Stripe',
];

// ── Billing Toggle ─────────────────────────────────────────────────────────
function BillingToggle({
  yearly,
  onToggle,
}: {
  yearly: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <span
        className={`text-sm font-medium transition-colors duration-200 ${!yearly ? 'text-[var(--text)]' : 'text-[var(--muted)]'
          }`}
      >
        Monthly
      </span>

      <button
        onClick={onToggle}
        aria-label="Toggle billing period"
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${yearly ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
          }`}
      >
        <motion.span
          layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
          animate={{ left: yearly ? '1.5rem' : '0.25rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </button>

      <span
        className={`text-sm font-medium transition-colors duration-200 ${yearly ? 'text-[var(--text)]' : 'text-[var(--muted)]'
          }`}
      >
        Yearly
        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)]">
          Save 35%
        </span>
      </span>
    </div>
  );
}

// ── Plan Card ──────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  yearly,
  loading,
  onSelect,
  index,
}: {
  plan: Plan;
  yearly: boolean;
  loading: boolean;
  onSelect: (plan: Plan) => void;
  index: number;
}) {
  const {
    name,
    icon: Icon,
    monthlyPrice,
    yearlyPrice,
    desc,
    borderClass,
    featured,
    iconClass,
    btnClass,
    badge,
    features,
    cta,
    accentColor,
  } = plan;

  const displayPrice = yearly ? yearlyPrice : monthlyPrice;
  const isFree = displayPrice === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`relative card flex flex-col border-2 p-8 transition-all duration-300 ${borderClass} ${featured
          ? 'scale-[1.03] shadow-[0_0_40px_-8px_var(--primary)] z-10'
          : 'hover:-translate-y-1 hover:border-[var(--primary)]/30'
        }`}
    >
      {/* Popular badge */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-white gradient-bg shadow-md whitespace-nowrap">
            <Sparkles className="w-3 h-3" />
            {badge}
          </span>
        </div>
      )}

      {/* Icon + name */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-bold text-[var(--text)]">{name}</p>
          <p className="text-[var(--muted)] text-xs">{desc}</p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-7">
        <div className="flex items-end gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${name}-${displayPrice}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="font-display font-black text-5xl text-[var(--text)]"
            >
              {isFree ? 'Free' : `$${displayPrice}`}
            </motion.span>
          </AnimatePresence>
          {!isFree && (
            <span className="text-[var(--muted)] text-sm mb-2">/mo</span>
          )}
        </div>
        {yearly && !isFree && monthlyPrice !== yearlyPrice && (
          <p className="text-xs text-[var(--muted)] mt-1">
            Billed annually · ${yearlyPrice * 12}/yr
            <span className="ml-1.5 line-through opacity-50">${monthlyPrice * 12}</span>
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
            <Check
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: accentColor }}
            />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect(plan)}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${btnClass}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            {cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [yearly, setYearly] = useState(false);

  const handlePlanClick = async (plan: Plan) => {
    const priceId = yearly ? plan.yearlyPriceId : plan.priceId;

    // Free / Enterprise — navigate directly, no Stripe checkout
    if (!priceId) {
      if (plan.href) window.location.href = plan.href;
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const res = await api.post('/payments/create-subscription-session', { priceId });

      // Modern Stripe SDK: always redirect via the session URL returned by the server.
      // stripe.redirectToCheckout({ sessionId }) was removed in @stripe/stripe-js v2+.
      const checkoutUrl: string | undefined = res.data?.url;
      if (!checkoutUrl) {
        throw new Error('No checkout URL returned from server.');
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ?? 'Failed to start checkout. Please try again.'
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-28 relative overflow-hidden" id="pricing">
      <div className="divider absolute top-0 inset-x-0" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.06, 0.13, 0.06] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--primary)] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-sm font-medium mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl font-bold text-[var(--text)]"
          >
            Simple, transparent{' '}
            <span className="gradient-text">pricing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[var(--muted)] mt-4 text-base"
          >
            No hidden fees. Cancel anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.26 }}
          >
            <BillingToggle yearly={yearly} onToggle={() => setYearly((y) => !y)} />
          </motion.div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              yearly={yearly}
              loading={loadingPlan === plan.name}
              onSelect={handlePlanClick}
              index={i}
            />
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[var(--muted)] text-sm"
        >
          {trustBadges.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}