'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import api from '@/lib/api';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48" />
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

export default function UpcomingEventsSlider() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const VISIBLE = 3;

  useEffect(() => {
    api.get('/events?upcoming=true&limit=9&type=PUBLIC')
      .then(r => setEvents(r.data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxIndex = Math.max(0, events.length - VISIBLE);
  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(maxIndex, i + 1));

  return (
    <section className="py-28 relative">
      <div className="divider absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--warning)]/10 border border-[var(--warning)]/25 text-[var(--warning)] text-sm font-medium mb-4">
              <Flame className="w-4 h-4" /> Trending Now
            </div>
            <h2 className="reveal font-display text-4xl sm:text-5xl font-bold text-[var(--text)] stagger-1">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="reveal text-[var(--muted)] mt-2 stagger-2">Don't miss out — these events are filling fast</p>
          </div>

          {!loading && events.length > VISIBLE && (
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                onClick={prev} disabled={current === 0}
                className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/8 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                onClick={next} disabled={current === maxIndex}
                className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/8 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted)]">No upcoming events yet — check back soon!</div>
          ) : (
            <motion.div
              className="flex gap-6"
              animate={{ x: `${-current * (100 / VISIBLE)}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              style={{ width: `${(events.length / VISIBLE) * 100}%` }}
            >
              {events.map((e, i) => (
                <div key={e.id} style={{ width: `${100 / events.length}%` }}>
                  <EventCard event={e} index={i} />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Dot indicators */}
        {!loading && events.length > VISIBLE && (
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--border-2)] hover:bg-[var(--muted)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
