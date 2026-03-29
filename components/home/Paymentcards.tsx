'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  ArrowRight,
  Receipt,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

// ── Stripe ─────────────────────────────────────────────────────────────────
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── Types ──────────────────────────────────────────────────────────────────
interface Payment {
  _id: string;
  eventId: string;
  eventTitle?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
  receiptUrl?: string;
}

interface CheckoutProps {
  eventId: string;
  eventTitle: string;
  amount: number;       // in cents
  currency?: string;
  onSuccess?: () => void;
}

interface PaymentCardsProps extends Partial<CheckoutProps> {
  defaultTab?: Tab;
}

type Tab = 'checkout' | 'history';

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_MAP = {
  succeeded: { icon: CheckCircle2, label: 'Paid', color: 'var(--success)' },
  pending: { icon: Clock, label: 'Pending', color: 'var(--warning)' },
  failed: { icon: XCircle, label: 'Failed', color: '#ef4444' },
} as const;

function formatCurrency(amount: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const STRIPE_STYLE = {
  style: {
    base: {
      color: 'var(--text)',
      fontFamily: 'inherit',
      fontSize: '14px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: 'var(--muted)' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ── Minimal InView hook ────────────────────────────────────────────────────
function useInViewSimple() {
  const [ref, setRef] = useState<Element | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return { ref: setRef, inView };
}

// ── Checkout Form ──────────────────────────────────────────────────────────
function CheckoutForm({ eventId, eventTitle, amount, currency = 'usd', onSuccess }: CheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const fieldWrap = (name: string) =>
    `px-3.5 py-3 rounded-xl border transition-all duration-200 bg-[var(--surface)] ${focused === name
      ? 'border-[var(--primary)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)]'
      : 'border-[var(--border)] hover:border-[var(--primary)]/40'
    }`;

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!cardholderName.trim()) {
      toast.error('Please enter the cardholder name.');
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    setPaying(true);
    try {
      // 1. Create session via your existing endpoint
      const { data } = await api.post('/payments/create-session', { eventId });

      // 2a. Backend returns a hosted Stripe URL → redirect
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // 2b. Backend returns a clientSecret → confirm on the frontend
      if (data.clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: {
              card: cardNumber,
              billing_details: { name: cardholderName.trim() },
            },
          }
        );
        if (error) throw new Error(error.message);
        if (paymentIntent?.status === 'succeeded') {
          setDone(true);
          toast.success('Payment successful!');
          onSuccess?.();
        }
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  // Success screen
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 flex flex-col items-center gap-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-[var(--success)]/15 flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
        </motion.div>
        <div>
          <p className="font-display font-bold text-[var(--text)] text-lg">Payment Successful!</p>
          <p className="text-[var(--muted)] text-sm mt-1">
            You're confirmed for{' '}
            <span className="text-[var(--text)] font-semibold">{eventTitle}</span>
          </p>
        </div>
        <Link href={`/events/${eventId}`}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white gradient-bg glow-primary shadow-md mt-2"
          >
            View Event <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="card p-6 flex flex-col gap-5">

      {/* Event summary strip */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[var(--text)] text-sm truncate">{eventTitle}</p>
            <p className="text-[var(--muted)] text-xs">1 ticket</p>
          </div>
        </div>
        <span className="font-display font-black text-[var(--text)] text-lg flex-shrink-0 ml-3">
          {formatCurrency(amount, currency)}
        </span>
      </div>

      {/* Cardholder name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
          placeholder="Jane Smith"
          className={`w-full text-sm outline-none ${fieldWrap('name')}`}
        />
      </div>

      {/* Card number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          Card Number
        </label>
        <div className={fieldWrap('number')}>
          <CardNumberElement
            options={STRIPE_STYLE}
            onFocus={() => setFocused('number')}
            onBlur={() => setFocused(null)}
          />
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            Expiry
          </label>
          <div className={fieldWrap('expiry')}>
            <CardExpiryElement
              options={STRIPE_STYLE}
              onFocus={() => setFocused('expiry')}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            CVC
          </label>
          <div className={fieldWrap('cvc')}>
            <CardCvcElement
              options={STRIPE_STYLE}
              onFocus={() => setFocused('cvc')}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--success)]/8 border border-[var(--success)]/20">
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0" />
        <p className="text-[11px] text-[var(--muted)] leading-snug">
          Encrypted and handled securely by Stripe. We never store raw card data.
        </p>
      </div>

      {/* Pay button */}
      <motion.button
        whileHover={{ scale: paying ? 1 : 1.02 }}
        whileTap={{ scale: paying ? 1 : 0.97 }}
        onClick={handlePay}
        disabled={paying || !stripe}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white gradient-bg glow-primary shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      >
        {paying ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
        ) : (
          <><Zap className="w-4 h-4" /> Pay {formatCurrency(amount, currency)} <ArrowRight className="w-4 h-4" /></>
        )}
      </motion.button>

    </div>
  );
}

// ── Payment Row ────────────────────────────────────────────────────────────
function PaymentRow({ payment, index }: { payment: Payment; index: number }) {
  const { ref, inView } = useInViewSimple();
  const status = STATUS_MAP[payment.status] ?? STATUS_MAP.pending;
  const Icon = status.icon;

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group card p-4 flex items-center gap-4 hover:border-[var(--primary)]/30 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${status.color}18` }}
      >
        <Icon className="w-4 h-4" style={{ color: status.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[var(--text)] text-sm truncate">
          {payment.eventTitle ?? `Event #${payment.eventId.slice(-6)}`}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted)]">
          <Calendar className="w-3 h-3" />
          {formatDate(payment.createdAt)}
          <span
            className="px-1.5 py-0.5 rounded-full font-semibold text-[10px]"
            style={{ color: status.color, background: `${status.color}18` }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-display font-bold text-[var(--text)] text-sm">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
        {payment.receiptUrl && (
          <a
            href={payment.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View receipt"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Payment History ────────────────────────────────────────────────────────
function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/payments/my')
      .then(({ data }) => setPayments(data.payments ?? data ?? []))
      .catch(() => toast.error('Could not load payment history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
          <Receipt className="w-4 h-4 text-[var(--primary)]" />
        </div>
        <div>
          <h3 className="font-display font-bold text-[var(--text)] text-base">Payment History</h3>
          <p className="text-[var(--muted)] text-xs">All your past transactions</p>
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-[var(--border)]" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 w-40 rounded bg-[var(--border)]" />
                <div className="h-2.5 w-24 rounded bg-[var(--border)]" />
              </div>
              <div className="h-3 w-14 rounded bg-[var(--border)]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && payments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-10 flex flex-col items-center gap-3 text-center border-dashed"
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <p className="font-display font-bold text-[var(--text)]">No payments yet</p>
          <p className="text-[var(--muted)] text-sm">Your transaction history will appear here.</p>
          <Link href="/events">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white gradient-bg glow-primary shadow-md mt-1"
            >
              Browse Events <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* List */}
      {!loading && payments.length > 0 && (
        <div className="flex flex-col gap-3">
          {payments.map((p, i) => (
            <PaymentRow key={p._id} payment={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inner (needs Elements context) ────────────────────────────────────────
function PaymentCardsInner({
  eventId,
  eventTitle,
  amount,
  currency,
  onSuccess,
  defaultTab = 'checkout',
}: PaymentCardsProps) {
  const hasCheckout = Boolean(eventId && eventTitle && amount);
  const [tab, setTab] = useState<Tab>(hasCheckout ? defaultTab : 'history');

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">

      {/* Tab bar — only when both panels are available */}
      {hasCheckout && (
        <div className="flex gap-1 p-1 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
          {(['checkout', 'history'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors duration-200 ${tab === t ? 'text-[var(--text)]' : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {t === 'checkout'
                  ? <><CreditCard className="w-3.5 h-3.5" /> Checkout</>
                  : <><Receipt className="w-3.5 h-3.5" /> History</>
                }
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Panels */}
      <AnimatePresence mode="wait">
        {tab === 'checkout' && hasCheckout ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
          >
            <CheckoutForm
              eventId={eventId!}
              eventTitle={eventTitle!}
              amount={amount!}
              currency={currency}
              onSuccess={onSuccess}
            />
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <PaymentHistory />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
// Checkout + history:
//   <PaymentCards eventId="abc" eventTitle="React Summit" amount={2999} currency="usd" />
//
// History only (e.g. profile/billing page):
//   <PaymentCards defaultTab="history" />
export default function PaymentCards(props: PaymentCardsProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentCardsInner {...props} />
    </Elements>
  );
}