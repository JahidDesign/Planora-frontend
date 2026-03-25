'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles, Users, Zap, Globe, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useCountUp, useInView } from '@/hooks/useAnimations';
import api from '@/lib/api';

// Animated particle canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number; color: string }[] = [];
    const colors = ['rgba(139,92,246,', 'rgba(34,211,238,', 'rgba(167,139,250,'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.o + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />;
}

// Typewriter effect
function TypewriterText({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false); }, 1800);
      return () => clearTimeout(t);
    }
    const speed = deleting ? 40 : 80;
    const current = words[idx];
    const t = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < current.length) setDisplayed(current.slice(0, displayed.length + 1));
        else setPaused(true);
      } else {
        if (displayed.length > 0) setDisplayed(displayed.slice(0, -1));
        else { setDeleting(false); setIdx((i) => (i + 1) % words.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, deleting, paused, idx, words]);

  return (
    <span className="gradient-text text-glow-p">
      {displayed}
      <span className="animate-[blinkCursor_0.7s_step-end_infinite] border-r-[3px] border-[var(--primary)] ml-0.5">&nbsp;</span>
    </span>
  );
}

// Stats with animated counter
function StatItem({ value, suffix, label, icon: Icon, delay }: any) {
  const { ref, inView } = useInView(0.3);
  const count = useCountUp(value, 2000, inView);

  return (
    <div ref={ref} className="text-center reveal" style={{ transitionDelay: `${delay}ms` }}>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
        <span className="font-display font-bold text-3xl sm:text-4xl text-[var(--text)]">
          {inView ? count.toLocaleString() : '0'}{suffix}
        </span>
      </div>
      <p className="text-[var(--muted)] text-sm">{label}</p>
    </div>
  );
}

export default function HeroSection() {
  const [featured, setFeatured] = useState<any>(null);

  useEffect(() => {
    api.get('/events/featured').then(r => setFeatured(r.data.event)).catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16">
      {/* Canvas particles */}
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full bg-[var(--primary)] blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-[var(--accent)] blur-[100px] pointer-events-none"
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              {/* Label pill */}
              {/* <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/25 text-[var(--primary)] text-sm font-medium mb-8"
              >
                <span className="live-dot" />
                <span>Live Event Platform</span>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div> */}

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-lexend leading-[1.04] tracking-tight"
              >
                <span className="text-[var(--text)]">Where</span>
                <br />
                <TypewriterText words={['Ideas Meet', 'People Connect', 'Magic Happens', 'Events Live']} />
                <br />
                <span className="text-[var(--text)]">In Real Time</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 text-[var(--muted)] text-lg leading-relaxed max-w-lg"
              >
                Planora is the only event platform where creation, discovery, and participation 
                happen in real time — with instant notifications, live participant counts, and seamless payments.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white gradient-bg glow-primary shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    Explore Events
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-[var(--primary)] border-2 border-[var(--primary)]/40 bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    Create for Free
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {['#8B5CF6','#22D3EE','#10B981','#F59E0B','#EF4444'].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--bg)] flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: c }}>
                      {['A','B','C','D','E'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-[var(--warning)] text-sm">{'★★★★★'}</div>
                  <p className="text-[var(--muted)] text-xs mt-0.5">Loved by 250K+ event-goers</p>
                </div>
              </motion.div>
            </div>

            {/* Right — Featured Event + floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,0.3,1] }}
              className="hidden lg:block relative h-[520px]"
            >
              {/* Main featured card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-0 top-0 card overflow-hidden animate-border-glow shadow-2xl"
              >
                {featured?.imageUrl ? (
                  <div className="relative h-44 overflow-hidden">
                    <img src={featured.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 badge badge-live text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="live-dot !w-2 !h-2" /> Featured
                    </span>
                  </div>
                ) : (
                  <div className="h-44 gradient-bg flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white/60" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-bold text-xl text-[var(--text)] leading-snug">
                    {featured?.title ?? 'Next.js Summit 2025'}
                  </h3>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-[var(--muted)] text-sm">
                      <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {featured ? format(new Date(featured.date), 'MMM d, yyyy') : 'Nov 14, 2025'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[var(--muted)] text-sm">
                      <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {featured?._count?.participants ?? 150} joined
                    </span>
                  </div>
                  <Link href={featured ? `/events/${featured.id}` : '/events'}>
                    <button className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-white gradient-bg glow-primary hover:opacity-90 transition-opacity">
                      {featured?.fee > 0 ? `Join — $${featured.fee}` : 'Join Free →'}
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Floating stat: Revenue */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-2 left-0 card p-4 w-48 shadow-xl"
              >
                <p className="text-[var(--muted)] text-xs mb-1">Platform Revenue</p>
                <p className="font-display font-bold text-2xl text-[var(--accent)]">$2.4M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                  <span className="text-[var(--success)] text-xs">+28% this month</span>
                </div>
              </motion.div>

              {/* Floating stat: Events */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-2 right-0 card p-4 w-44 shadow-xl"
              >
                <p className="text-[var(--muted)] text-xs mb-1">Live Now</p>
                <p className="font-display font-bold text-2xl gradient-text">24</p>
                <p className="text-[var(--muted)] text-xs mt-1">events happening</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatItem value={10000} suffix="+" label="Events Created" icon={Calendar} delay={0} />
            <StatItem value={250000} suffix="+" label="Happy Attendees" icon={Users} delay={100} />
            <StatItem value={120} suffix="+" label="Cities Worldwide" icon={Globe} delay={200} />
            <StatItem value={99} suffix="%" label="Uptime SLA" icon={TrendingUp} delay={300} />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </section>
  );
}
