
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Crown, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const PLAN_CONFIG = {
  FREE: {
    label: 'Free Plan',
    icon: Zap,
    color: 'text-[var(--muted)]',
    bg: 'bg-[var(--surface-2)]',
    border: 'border-[var(--border)]',
    badge: 'bg-[var(--surface-2)] text-[var(--muted)]',
    perks: ['3 active events', '50 participants', 'Public events only'],
  },
  PRO: {
    label: 'Pro Plan',
    icon: Star,
    color: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary)]/5',
    border: 'border-[var(--primary)]/30',
    badge: 'gradient-bg text-white',
    perks: ['Unlimited events', 'Unlimited participants', 'Private events', 'Priority support'],
  },
  ENTERPRISE: {
    label: 'Enterprise Plan',
    icon: Crown,
    color: 'text-[var(--warning)]',
    bg: 'bg-[var(--warning)]/5',
    border: 'border-[var(--warning)]/30',
    badge: 'bg-[var(--warning)]/20 text-[var(--warning)]',
    perks: ['Everything in Pro', 'Custom domain', 'SSO & SAML', 'Dedicated manager'],
  },
};

export default function SubscriptionCard() {
  const { user, fetchUser } = useAuthStore();
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const plan = (user?.plan as keyof typeof PLAN_CONFIG) || 'FREE';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.FREE;
  const Icon = config.icon;
  const isPaid = plan !== 'FREE';

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      await api.post('/payments/cancel-subscription');
      toast.success('Subscription cancelled. You\'ll keep Pro until the end of your billing period.');
      await fetchUser?.();
      setShowConfirm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-6 ${config.bg} ${config.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPaid ? 'gradient-bg text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[var(--text)] font-semibold">{config.label}</p>
            <p className="text-[var(--muted)] text-xs">Your current subscription</p>
          </div>
        </div>

        {/* Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badge}`}>
          {plan}
        </span>
      </div>

      {/* Perks */}
      <div className="space-y-2 mb-6">
        {config.perks.map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`} />
            {perk}
          </div>
        ))}
      </div>

      {/* Actions */}
      {!isPaid ? (
        <Link href="/#pricing">
          <button className="w-full py-3 rounded-xl text-sm font-bold gradient-bg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Star className="w-4 h-4" /> Upgrade to Pro
          </button>
        </Link>
      ) : (
        <div className="space-y-2">
          <Link href="/#pricing" className="block">
            <button className="w-full py-2.5 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> Manage Plan
            </button>
          </Link>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-[var(--error)]/70 hover:text-[var(--error)] hover:bg-[var(--error)]/5 transition-colors"
            >
              Cancel Subscription
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-[var(--error)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Are you sure? You'll lose Pro features at the end of your billing period.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 py-2 rounded-lg text-xs font-medium bg-[var(--error)] text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {cancelling ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Cancelling…</>
                  ) : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}