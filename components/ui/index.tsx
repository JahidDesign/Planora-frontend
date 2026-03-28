'use client';

import { clsx } from 'clsx';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ─── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-sans';

    const variants: Record<string, string> = {
      primary: 'gradient-bg text-white shadow-[0_0_0_0_rgba(139,92,246,0)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-90',
      accent: 'bg-[var(--accent)] hover:bg-[var(--accent-dk)] text-[var(--bg)] font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]',
      outline: 'border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)]/10',
      ghost: 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] bg-transparent',
      danger: 'bg-[var(--error)]/15 text-[var(--error)] border border-[var(--error)]/30 hover:bg-[var(--error)]/25',
    };

    const sizes: Record<string, string> = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconRight, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text)] mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">{icon}</div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted-2)] rounded-xl px-4 py-3 text-sm',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/25',
            'transition-all duration-200',
            icon && 'pl-10',
            iconRight && 'pr-10',
            error && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">{iconRight}</div>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-[var(--error)]">
          {error}
        </motion.p>
      )}
    </div>
  )
);
Input.displayName = 'Input';

// ─── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text)] mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted-2)] rounded-xl px-4 py-3 text-sm resize-none',
          'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/25 transition-all duration-200',
          error && 'border-[var(--error)]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

// ─── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--text)] mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={clsx(
          'w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl px-4 py-3 text-sm appearance-none',
          'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/25 transition-all duration-200',
          error && 'border-[var(--error)]',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-[var(--error)]">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// ─── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

export function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-48 rounded-none rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-4 flex justify-between border-t border-[var(--border)]">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
// components/ui/Skeletons.tsx (or wherever EventCardSkeleton is defined)

export function BlogCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-48 bg-[var(--surface-2)]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-[var(--surface-2)] rounded-lg w-3/4" />
        <div className="h-4 bg-[var(--surface-2)] rounded-lg w-full" />
        <div className="h-4 bg-[var(--surface-2)] rounded-lg w-2/3" />
        <div className="pt-3 border-t border-[var(--border)] flex justify-between">
          <div className="h-3 bg-[var(--surface-2)] rounded w-1/4" />
          <div className="h-3 bg-[var(--surface-2)] rounded w-1/6" />
        </div>
      </div>
    </div>
  );
}
// ─── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={clsx(
              'relative w-full glass rounded-2xl shadow-2xl border border-[var(--border)] p-6',
              maxWidth
            )}
          >
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold text-[var(--text)]">{title}</h2>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'muted';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  const map: Record<string, string> = {
    primary: 'bg-[var(--primary)]/15 text-[var(--primary-lt)] border-[var(--primary)]/30',
    accent: 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30',
    success: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
    warning: 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
    error: 'bg-[var(--error)]/15 text-[var(--error)] border-[var(--error)]/30',
    muted: 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]',
  };
  return (
    <span className={clsx('badge', map[variant], className)}>{children}</span>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {icon && <div className="text-5xl mb-5 animate-float">{icon}</div>}
      <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
      {description && <p className="text-[var(--muted)] text-sm max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
export function StarRating({ rating, onRate, interactive = false }: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onRate?.(star)}
          className={clsx(
            'text-xl leading-none transition-all duration-100',
            star <= rating ? 'text-[var(--warning)]' : 'text-[var(--border-2)]',
            interactive && 'hover:text-[var(--warning)] cursor-pointer hover:scale-125'
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ label, title, titleHighlight, description }: {
  label?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--surface)]" />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[var(--primary)] rounded-full blur-[80px] pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {label && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-xs font-semibold mb-4">
            {label}
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="font-display text-4xl sm:text-5xl font-bold text-[var(--text)]">
          {title}{' '}
          {titleHighlight && <span className="gradient-text">{titleHighlight}</span>}
        </motion.h1>
        {description && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-3 text-[var(--muted)] text-lg max-w-xl">
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
