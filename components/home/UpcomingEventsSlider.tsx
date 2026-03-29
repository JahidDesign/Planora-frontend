'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import api from '@/lib/api';

// ── Breakpoint-aware visible count ────────────────────────────────────────
function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

// ── Skeleton Card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card overflow-hidden w-full">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-2/3" />
        <div className="pt-3 flex justify-between">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-10" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function UpcomingEventsSlider() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const visible = useVisibleCount();

  useEffect(() => {
    api.get('/events?upcoming=true&limit=9&type=PUBLIC')
      .then(r => setEvents(r.data.events || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Reset position when visible count changes (e.g. window resize)
  useEffect(() => {
    setCurrent(0);
  }, [visible]);

  const maxIndex = Math.max(0, events.length - visible);
  const clamp = (v: number) => Math.max(0, Math.min(maxIndex, v));

  const prev = useCallback(() => setCurrent(i => clamp(i - 1)), [maxIndex]);
  const next = useCallback(() => setCurrent(i => clamp(i + 1)), [maxIndex]);

  // Touch / swipe support
  const touchStartX = useCallback((e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const handleEnd = (ev: TouchEvent) => {
      const dx = ev.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      document.removeEventListener('touchend', handleEnd);
    };
    document.addEventListener('touchend', handleEnd, { once: true });
  }, [prev, next]);

  const showNav = !loading && events.length > visible;
  const cardWidthPct = visible > 0 ? 100 / visible : 100;
  const offsetPct = -(current * cardWidthPct);

  return (
    <section className="py-16 sm:py-20 lg:py-28 relative">
      <div className="divider absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--warning)]/10 border border-[var(--warning)]/25 text-[var(--warning)] text-sm font-medium mb-3 sm:mb-4">
              <Flame className="w-4 h-4" />
              Trending Now
            </div>
            <h2 className="reveal font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] stagger-1 leading-tight">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="reveal text-[var(--muted)] mt-2 text-sm sm:text-base stagger-2">
              Don't miss out — these events are filling fast
            </p>
          </div>

          {/* Desktop nav arrows */}
          {showNav && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <NavButton onClick={prev} disabled={current === 0} direction="left" />
              <NavButton onClick={next} disabled={current === maxIndex} direction="right" />
            </div>
          )}
        </div>

        {/* ── Carousel Track ──
            On mobile: negative margin breaks out of the section's px-4 so the
            card fills edge-to-edge, then px-4 re-adds inner breathing room.
            pb-2 gives card shadows room so they're not clipped at the bottom.
            On sm+: reset to normal flow (mx-0 px-0 pb-0).
        ── */}
        <div
          className="overflow-hidden -mx-4 px-4 pb-3 sm:mx-0 sm:px-0 sm:pb-0"
          onTouchStart={touchStartX}
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: visible }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted)] text-sm sm:text-base">
              No upcoming events yet — check back soon!
            </div>
          ) : (
            <motion.div
              className="flex gap-4 sm:gap-6"
              animate={{ x: `${offsetPct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }}
              style={{ width: `${(events.length / visible) * 100}%` }}
            >
              {events.map((e, i) => (
                <div
                  key={e.id}
                  style={{ width: `${100 / events.length}%` }}
                  className="min-w-0"
                >
                  <EventCard event={e} index={i} />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Bottom Controls ── */}
        {showNav && (
          <div className="flex items-center justify-between mt-5 sm:mt-8">
            {/* Mobile-only arrow row */}
            <div className="flex sm:hidden items-center gap-2">
              <NavButton onClick={prev} disabled={current === 0} direction="left" />
              <NavButton onClick={next} disabled={current === maxIndex} direction="right" />
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:flex-1 sm:justify-center">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                      ? 'w-8 bg-[var(--primary)]'
                      : 'w-2 bg-[var(--border-2)] hover:bg-[var(--muted)]'
                    }`}
                />
              ))}
            </div>

            {/* Spacer to balance flex on desktop */}
            <div className="hidden sm:block w-[88px]" />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Nav Button ─────────────────────────────────────────────────────────────
function NavButton({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: 'left' | 'right';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/8 transition-all disabled:opacity-30 disabled:pointer-events-none"
    >
      {direction === 'left'
        ? <ChevronLeft className="w-5 h-5" />
        : <ChevronRight className="w-5 h-5" />}
    </motion.button>
  );
}