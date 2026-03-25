'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageSquare, User, Image as ImageIcon,
  Send, CheckCircle2, Sparkles, MapPin, Clock, ArrowRight, X,
} from 'lucide-react';
import api from '@/lib/api';

// ── helpers ────────────────────────────────────────────────────────────────

const contactMeta = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@planora.io',
    color: 'var(--primary)',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'Remote — 18 countries',
    color: 'var(--accent)',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours',
    color: 'var(--success)',
  },
];

// ── FloatingLabel input wrapper ────────────────────────────────────────────

function Field({
  id,
  label,
  icon: Icon,
  optional = false,
  textarea = false,
  value,
  onChange,
  type = 'text',
  color = 'var(--primary)',
}: {
  id: string;
  label: string;
  icon: any;
  optional?: boolean;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  color?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  const base =
    'w-full bg-transparent text-[var(--text)] text-sm outline-none placeholder-transparent resize-none';

  return (
    <div className="relative">
      {/* border ring */}
      <div
        className="relative rounded-xl border transition-all duration-200"
        style={{
          borderColor: focused ? color : 'var(--border)',
          boxShadow: focused ? `0 0 0 3px ${color}22` : 'none',
        }}
      >
        {/* icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ top: textarea ? 22 : undefined }}>
          <Icon className="w-4 h-4" style={{ color: focused ? color : 'var(--muted)' }} />
        </div>

        {/* floating label */}
        <label
          htmlFor={id}
          className="absolute left-10 transition-all duration-150 pointer-events-none select-none"
          style={{
            top: active ? (textarea ? 8 : 6) : '50%',
            transform: active ? 'none' : 'translateY(-50%)',
            fontSize: active ? 10 : 14,
            color: focused ? color : 'var(--muted)',
          }}
        >
          {label}
          {optional && <span className="ml-1 opacity-50">(optional)</span>}
        </label>

        {textarea ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            placeholder={label}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className={`${base} px-4 pt-6 pb-3`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            placeholder={label}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className={`${base} px-4 pt-5 pb-2 h-14`}
          />
        )}
      </div>
    </div>
  );
}

// ── PhotoUpload ────────────────────────────────────────────────────────────

function PhotoUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-2 flex items-center gap-1">
        <ImageIcon className="w-3.5 h-3.5" /> Photo
        <span className="opacity-50">(optional)</span>
      </p>

      {value ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--border)] group">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200"
          style={{
            borderColor: dragging ? 'var(--primary)' : 'var(--border)',
            background: dragging ? 'var(--primary)08' : 'transparent',
          }}
        >
          <ImageIcon className="w-6 h-6 text-[var(--muted)]" />
          <p className="text-xs text-[var(--muted)] text-center">
            Drop image or <span className="text-[var(--primary)] font-medium">browse</span>
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '', photo: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async () => {
    if (!form.message.trim()) {
      setError('Message is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', {
        ...(form.name && { name: form.name }),
        ...(form.email && { email: form.email }),
        message: form.message,
        ...(form.photo && { photo: form.photo }),
      });
      setSuccess(true);
      setForm({ name: '', email: '', message: '', photo: '' });
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--bg)]">
      {/* Gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.14, 0.07] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--primary)] blur-[110px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.11, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--accent)] blur-[100px] pointer-events-none"
      />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">

        {/* Header */}
        <div className="text-center mb-16">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-[var(--text)]">We'd love to</span>
            <br />
            <span className="gradient-text text-glow-p">hear from you</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-5 text-[var(--muted)] text-lg max-w-xl mx-auto leading-relaxed"
          >
            Questions, feedback, partnerships — drop us a message and we'll get back to you within 24 hours.
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left — meta info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {contactMeta.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-5 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">{label}</p>
                  <p className="font-bold text-[var(--text)] text-sm">{value}</p>
                </div>
              </div>
            ))}

            {/* Decorative "send" illustration */}
            <div className="card p-6 flex flex-col gap-3 mt-2 overflow-hidden relative">
              <div className="absolute inset-0 gradient-bg opacity-5 pointer-events-none" />
              <MessageSquare className="w-8 h-8 text-[var(--primary)]" />
              <p className="font-display font-bold text-[var(--text)] text-lg leading-snug">
                Prefer a quick chat?
              </p>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Join our Discord community where the team hangs out daily and responds in real time.
              </p>
              <a
                href="https://discord.gg/planora"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-[var(--primary)] font-bold text-sm mt-1"
              >
                Join Discord
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 card p-8"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-5 py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--success)]/15 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[var(--success)]" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[var(--text)]">Message sent!</h3>
                  <p className="text-[var(--muted)] max-w-xs">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-[var(--primary)] font-bold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  <h3 className="font-display font-bold text-xl text-[var(--text)] mb-1">
                    Send a message
                  </h3>

                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      id="contact-name"
                      label="Name"
                      icon={User}
                      optional
                      value={form.name}
                      onChange={set('name')}
                    />
                    <Field
                      id="contact-email"
                      label="Email"
                      icon={Mail}
                      optional
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      color="var(--accent)"
                    />
                  </div>

                  {/* Message */}
                  <Field
                    id="contact-message"
                    label="Message"
                    icon={MessageSquare}
                    textarea
                    value={form.message}
                    onChange={set('message')}
                  />

                  {/* Photo upload */}
                  <PhotoUpload value={form.photo} onChange={set('photo')} />

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-[var(--error)] text-sm flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group mt-1 flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base text-white gradient-bg glow-primary shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-[var(--muted)]">
                    Only <span className="font-medium text-[var(--text)]">message</span> is required — everything else is optional.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </section>
  );
}