'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
interface LoginForm {
  email: string;
  password: string;
}

const features = [
  { icon: '🎯', text: 'Create & manage unlimited events' },
  { icon: '💳', text: 'Built-in Stripe payment processing' },
  { icon: '🔒', text: 'Private events with approval flow' },
  { icon: '⭐', text: 'Reviews and ratings system' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: 'onTouched' });

  const onSubmit = async (data: LoginForm) => {
    clearErrors();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      router.push(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');

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

      if (status === 401) {
        // Wrong credentials — field-level errors on both inputs
        setError('email', { type: 'server', message: ' ' }); // space keeps the error slot open
        setError('password', { type: 'server', message: 'Invalid email or password.' });
        toast.error('Invalid credentials. Please try again.');
        return;
      }

      if (status === 403) {
        toast.error('Your account has been suspended. Please contact support.');
        return;
      }

      if (status === 400 || status === 422) {
        if (fields) {
          (Object.entries(fields) as [keyof LoginForm, string][]).forEach(
            ([field, msg]) => setError(field, { type: 'server', message: msg })
          );
          toast.error('Please fix the highlighted fields and try again.');
        } else {
          toast.error(message ?? 'Invalid data. Please review your details.');
        }
        return;
      }

      if (status === 429) {
        toast.error('Too many login attempts. Please wait a moment before trying again.');
        return;
      }

      if (status >= 500) {
        toast.error('Something went wrong on our end. Please try again shortly.');
        return;
      }

      // ── Fallback ────────────────────────────────────────
      toast.error(message ?? 'Login failed. Please try again.');

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
          className="absolute top-1/4 -left-24 w-80 h-80 bg-[var(--primary)] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 11, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 -right-24 w-80 h-80 bg-[var(--accent)] rounded-full blur-[100px]"
        />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <Image src="/Planora.png" alt="Planora" width={180} height={40} />
          </Link>

          {/* Center content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-semibold mb-6">
                <Sparkles className="w-3 h-3" /> Premium Event Platform
              </div>
              <h2 className="font-display text-4xl font-extrabold text-[var(--text)] leading-tight mb-4">
                Welcome back to<br />
                <span className="gradient-text">Planora</span>
              </h2>
              <p className="text-[var(--muted)] leading-relaxed mb-10 max-w-sm">
                The platform where events come alive — from intimate workshops to massive conferences.
              </p>
              <div className="space-y-3">
                {features.map(f => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <span className="text-lg">{f.icon}</span> {f.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass rounded-2xl border border-[var(--border)] p-5"
          >
            <div className="flex text-[var(--warning)] text-sm mb-3">★★★★★</div>
            <p className="text-[var(--text)] text-sm italic leading-relaxed mb-4">
              "Planora is the only platform I trust to run my events professionally. The UX is unmatched."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                J
              </div>
              <div>
                <p className="text-[var(--text)] text-xs font-semibold">James Park</p>
                <p className="text-[var(--muted)] text-xs">Lead Organizer, DevConf</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
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

          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Sign in</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message?.trim() ? errors.email.message : undefined}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
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
              })}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={loading || isSubmitting}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] font-semibold mb-2.5 uppercase tracking-wider">
              🔑 Demo Access
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--accent)] font-semibold">User</span>
                <span className="text-[var(--muted)]">alice@example.com / User@1234</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[var(--muted)] text-sm mt-8">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="text-[var(--primary)] font-semibold hover:text-[var(--primary-lt)] transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}