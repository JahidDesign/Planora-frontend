'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, User, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const perks = [
  { icon: '🎯', text: 'Create unlimited public & private events' },
  { icon: '💳', text: 'Collect payments via Stripe — seamlessly' },
  { icon: '👥', text: 'Manage participants, approvals & bans' },
  { icon: '📬', text: 'Send custom invitations to anyone' },
  { icon: '⭐', text: 'Collect reviews and ratings post-event' },
  { icon: '🛡️', text: 'Role-based access for your whole team' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: 'onTouched' });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    clearErrors();
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(res.data.user, res.data.accessToken);
      toast.success(`Welcome to Planora, ${res.data.user.name}! 🎉`);
      router.push('/dashboard');

    } catch (err: any) {
      // ── Network / connectivity ──────────────────────────
      if (!navigator.onLine) {
        toast.error('You appear to be offline. Check your connection and try again.');
        return;
      }

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        toast.error('Request timed out. Please try again.');
        return;
      }

      if (!err.response) {
        toast.error('Could not reach the server. Please try again later.');
        return;
      }

      // ── Typed HTTP errors ───────────────────────────────
      const status = err.response.status as number;
      const message = err.response.data?.error as string | undefined;
      const fields = err.response.data?.fields as Record<string, string> | undefined;

      if (status === 409) {
        setError('email', { type: 'server', message: 'This email is already registered.' });
        toast.error('An account with that email already exists.');
        return;
      }

      if (status === 400 || status === 422) {
        if (fields) {
          (Object.entries(fields) as [keyof RegisterForm, string][]).forEach(
            ([field, msg]) => setError(field, { type: 'server', message: msg })
          );
          toast.error('Please fix the highlighted fields and try again.');
        } else {
          toast.error(message ?? 'Invalid data. Please review your details.');
        }
        return;
      }

      if (status === 429) {
        toast.error('Too many attempts. Please wait a moment before trying again.');
        return;
      }

      if (status >= 500) {
        toast.error('Something went wrong on our end. Please try again shortly.');
        return;
      }

      // ── Fallback ────────────────────────────────────────
      toast.error(message ?? 'Registration failed. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--surface)]">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-1/3 -left-24 w-80 h-80 bg-[var(--accent)] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/3 -right-24 w-80 h-80 bg-[var(--primary)] rounded-full blur-[100px]"
        />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <Image src="/Planora.png" alt="Planora" width={180} height={40} />
          </Link>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-semibold mb-6">
                <Sparkles className="w-3 h-3" /> Free Forever Plan Available
              </div>
              <h2 className="font-display text-4xl font-extrabold text-[var(--text)] leading-tight mb-4">
                Start building<br />
                <span className="gradient-text">amazing events</span>
              </h2>
              <p className="text-[var(--muted)] leading-relaxed mb-10 max-w-sm">
                No credit card required. Be up and running in under 2 minutes.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {perks.map(p => (
                  <div key={p.text} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <span className="text-base">{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-[var(--border)] p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {['#8B5CF6', '#22D3EE', '#10B981'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c }}
                  >
                    {['A', 'B', 'C'][i]}
                  </div>
                ))}
              </div>
              <p className="text-[var(--muted)] text-sm">
                <span className="text-[var(--text)] font-semibold">+10,000 organizers</span> joined this month
              </p>
            </div>
            <p className="text-[var(--text)] text-sm leading-relaxed">
              Join the fastest-growing event community. Create your first event today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">Planora</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Create your account</h1>
          <p className="text-[var(--muted)] mt-2 text-sm mb-8">Free forever — no credit card needed</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 50, message: 'Name is too long' },
              })}
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            {/* Password */}
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              icon={<Lock className="w-4 h-4" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters required' },
              })}
            />

            {/* Password strength bar */}
            {watch('password') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mt-2">
                <div className="h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width:
                        watch('password').length >= 12 ? '100%'
                          : watch('password').length >= 8 ? '66%'
                            : '33%',
                      background:
                        watch('password').length >= 12 ? 'var(--success)'
                          : watch('password').length >= 8 ? 'var(--warning)'
                            : 'var(--error)',
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {watch('password').length >= 12
                    ? '✓ Strong password'
                    : watch('password').length >= 8
                      ? '~ Medium strength'
                      : '✗ Weak password'}
                </p>
              </motion.div>
            )}

            {/* Confirm password */}
            <Input
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: v => v === password || 'Passwords do not match',
              })}
            />

            {/* Terms */}
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-[var(--primary)] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading || isSubmitting}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating your account…' : 'Create Free Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Trust signals */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {['No credit card', 'Cancel anytime', 'Free events free forever', 'Stripe in minutes'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <CheckCircle className="w-3 h-3 text-[var(--success)] flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <p className="text-center text-[var(--muted)] text-sm mt-8">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[var(--primary)] font-semibold hover:text-[var(--primary-lt)] transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}