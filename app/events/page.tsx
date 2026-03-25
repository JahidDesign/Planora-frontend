'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { Input, EventCardSkeleton, EmptyState, PageHeader, Button } from '@/components/ui';
import { useScrollReveal } from '@/hooks/useAnimations';
import api from '@/lib/api';
import { clsx } from 'clsx';

const FILTERS = [
  { label: 'All Events',   type: '', fee: '',     icon: '✦' },
  { label: 'Public Free',  type: 'PUBLIC',  fee: 'free', icon: '🌍' },
  { label: 'Public Paid',  type: 'PUBLIC',  fee: 'paid', icon: '💳' },
  { label: 'Private Free', type: 'PRIVATE', fee: 'free', icon: '🔒' },
  { label: 'Private Paid', type: 'PRIVATE', fee: 'paid', icon: '⭐' },
];

const CATEGORIES = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Health', 'Art', 'Science', 'Music'];

export default function EventsPage() {
  useScrollReveal();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterIdx, setFilterIdx] = useState(0);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Read URL params on mount
  useEffect(() => {
    const type = searchParams.get('type') || '';
    const fee  = searchParams.get('fee') || '';
    const idx = FILTERS.findIndex(f => f.type === type && f.fee === fee);
    if (idx > -1) setFilterIdx(idx);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const f = FILTERS[filterIdx];
      const params: Record<string, string> = {
        page: String(page), limit: '12',
        ...(search && { search }),
        ...(f.type && { type: f.type }),
        ...(f.fee && { fee: f.fee }),
        ...(category !== 'All' && { category }),
      };
      const res = await api.get(`/events?${new URLSearchParams(params)}`);
      setEvents(res.data.events || []);
      setPagination(res.data.pagination);
      setTotalCount(res.data.pagination?.total || 0);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterIdx, category, page]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchEvents, search ? 350 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [fetchEvents]);

  const handleFilter = (i: number) => { setFilterIdx(i); setPage(1); };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <PageHeader
          label="Discover"
          title="Find Your Next"
          titleHighlight="Event"
          description="Search thousands of events — filter by type, category, and more."
        />

        {/* Search + Filters bar */}
        <div className="sticky top-16 z-30 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search row */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 max-w-xl">
                <Input
                  placeholder="Search events or organizers..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  icon={<Search className="w-4 h-4" />}
                  iconRight={search ? (
                    <button onClick={() => setSearch('')} className="hover:text-[var(--error)] transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  ) : undefined}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200',
                  showFilters
                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 text-[var(--primary)]'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Type filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {FILTERS.map((f, i) => (
                <motion.button
                  key={f.label}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleFilter(i)}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                    i === filterIdx
                      ? 'gradient-bg text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]'
                  )}
                >
                  <span>{f.icon}</span> {f.label}
                </motion.button>
              ))}
            </div>

            {/* Category filters (collapsible) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-[var(--border)] mt-4">
                    <p className="text-xs text-[var(--muted)] font-semibold mb-3 uppercase tracking-wider">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setCategory(cat); setPage(1); }}
                          className={clsx(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                            category === cat
                              ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                              : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)]/40'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Events grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Results info */}
          <AnimatePresence mode="wait">
            {!loading && (
              <motion.div
                key={totalCount}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
              >
                <p className="text-[var(--muted)] text-sm">
                  <span className="text-[var(--text)] font-semibold">{totalCount.toLocaleString()}</span> events found
                  {search && <> for "<span className="text-[var(--primary)]">{search}</span>"</>}
                </p>
                {(search || filterIdx > 0 || category !== 'All') && (
                  <button
                    onClick={() => { setSearch(''); setFilterIdx(0); setCategory('All'); setPage(1); }}
                    className="text-xs text-[var(--muted)] hover:text-[var(--error)] flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No events found"
              description="Try adjusting your search or filters to discover more events."
              action={
                <Button onClick={() => { setSearch(''); setFilterIdx(0); setCategory('All'); }}>
                  <Zap className="w-4 h-4" /> Clear Filters
                </Button>
              }
            />
          ) : (
            <motion.div
              key={`${filterIdx}-${search}-${category}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && pagination && pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center gap-2 mt-12"
            >
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                ← Prev
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i-1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === '...' ? (
                  <span key={`dots-${i}`} className="text-[var(--muted)] px-1">…</span>
                ) : (
                  <button key={p}
                    onClick={() => setPage(p as number)}
                    className={clsx(
                      'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200',
                      p === page
                        ? 'gradient-bg text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]'
                    )}
                  >
                    {p}
                  </button>
                ))
              }
              <Button variant="outline" size="sm" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>
                Next →
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
