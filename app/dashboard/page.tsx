'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays, Users, Star, Mail, Plus, ArrowRight,
  TrendingUp, Clock, CheckCircle, Globe, Lock
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { EventCardSkeleton, Skeleton } from '@/components/ui';
import { useInView, useCountUp } from '@/hooks/useAnimations';
import EventCard from '@/components/events/EventCard';
import api from '@/lib/api';

function StatCard({ label, value, icon: Icon, color, href, delay }: any) {
  const { ref, inView } = useInView(0.2);
  const count = useCountUp(typeof value === 'number' ? value : 0, 1400, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={href}>
        <div className="card group cursor-pointer p-5 hover:-translate-y-1 transition-all duration-300 hover:border-[var(--primary)]/30 relative overflow-hidden">
          {/* Hover glow */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${color.replace('text-', 'bg-').replace('[var(--', '[var(--').split(')]')[0]}]/5 rounded-2xl`} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[var(--muted)] text-xs font-medium mb-2">{label}</p>
              <p className="font-display text-3xl font-bold text-[var(--text)]">
                {typeof value === 'number' ? count.toLocaleString() : value}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="relative mt-3 flex items-center gap-1.5 text-xs text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors">
            View all <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, color, text, time }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text)] text-sm">{text}</p>
        <p className="text-[var(--muted)] text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ events: 0, participants: 0, reviews: 0, invitations: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [participatedEvents, setParticipatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  useEffect(() => {
    Promise.all([
      api.get('/events/my-events'),
      api.get('/reviews/my'),
      api.get('/invitations/my'),
      api.get('/users/participated-events'),
    ]).then(([eventsRes, reviewsRes, invitationsRes, participatedRes]) => {
      const events = eventsRes.data.events || [];
      const reviews = reviewsRes.data.reviews || [];
      const invitations = invitationsRes.data.invitations || [];
      const participated = participatedRes.data.participants || [];
      const totalParticipants = events.reduce((s: number, e: any) => s + (e._count?.participants || 0), 0);

      setStats({ events: events.length, participants: totalParticipants, reviews: reviews.length, invitations: invitations.length });
      setRecentEvents(events.slice(0, 3));
      setParticipatedEvents(participated.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'My Events',         value: stats.events,       icon: CalendarDays, color: 'text-[var(--primary)]', href: '/dashboard/my-events' },
    { label: 'Total Participants', value: stats.participants, icon: Users,        color: 'text-[var(--accent)]',  href: '/dashboard/my-events' },
    { label: 'Reviews Written',   value: stats.reviews,      icon: Star,         color: 'text-[var(--warning)]', href: '/dashboard/reviews' },
    { label: 'Invitations',       value: stats.invitations,  icon: Mail,         color: 'text-[var(--success)]', href: '/dashboard/invitations' },
  ];

  // Simulated live activity
  const activity = [
    { icon: CheckCircle, color: 'bg-[var(--success)]/15 text-[var(--success)]', text: 'Someone just joined your event', time: '2 min ago' },
    { icon: Star,        color: 'bg-[var(--warning)]/15 text-[var(--warning)]', text: 'New 5★ review received',         time: '1 hr ago' },
    { icon: Mail,        color: 'bg-[var(--primary)]/15 text-[var(--primary)]', text: 'You received a new invitation',   time: '3 hr ago' },
    { icon: TrendingUp,  color: 'bg-[var(--accent)]/15 text-[var(--accent)]',   text: 'Your event reached 100 joined',  time: 'Yesterday' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[var(--muted)] text-sm mb-1"
          >
            {format(new Date(), 'EEEE, MMMM d')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl font-bold text-[var(--text)]"
          >
            {greeting},{' '}
            <span className="gradient-text">{user?.name.split(' ')[0]}</span> 👋
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/dashboard/my-events?create=true">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Pending invitations banner */}
      {stats.invitations > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/8 p-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-transparent" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-[var(--text)] text-sm font-semibold">
                  {stats.invitations} pending invitation{stats.invitations > 1 ? 's' : ''}
                </p>
                <p className="text-[var(--muted)] text-xs">Waiting for your response</p>
              </div>
            </div>
            <Link href="/dashboard/invitations">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg flex-shrink-0">
                View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Events — 2 cols */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-[var(--text)]">My Recent Events</h2>
            <Link href="/dashboard/my-events"
              className="text-xs text-[var(--primary)] flex items-center gap-1 hover:gap-1.5 transition-all font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="card p-10 text-center">
              <CalendarDays className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-40" />
              <p className="text-[var(--text)] font-semibold mb-1">No events yet</p>
              <p className="text-[var(--muted)] text-sm mb-4">Create your first event to get started</p>
              <Link href="/dashboard/my-events?create=true">
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg">
                  Create Event
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 opacity-80">
                          <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--text)] truncate text-sm">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`badge ${event.type === 'PRIVATE' ? 'badge-private' : 'badge-public'}`}>
                            {event.type === 'PRIVATE' ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                            {event.type}
                          </span>
                          <span className={`badge ${event.fee > 0 ? 'badge-paid' : 'badge-free'}`}>
                            {event.fee > 0 ? `$${event.fee}` : 'Free'}
                          </span>
                          <span className="text-[var(--muted)] text-xs flex items-center gap-1">
                            <Users className="w-3 h-3" /> {event._count?.participants || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[var(--muted)] text-xs">{format(new Date(event.date), 'MMM d')}</p>
                        {event.participants?.length > 0 && (
                          <span className="badge badge-pending mt-1">{event.participants.length} pending</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — Activity + Quick actions */}
        <div className="space-y-5">
          {/* Live Activity */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="live-dot" />
              <h3 className="font-display font-bold text-sm text-[var(--text)]">Live Activity</h3>
            </div>
            <div className="space-y-4">
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <ActivityItem {...a} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-sm text-[var(--text)] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create Event',   href: '/dashboard/my-events?create=true', icon: Plus,         color: 'bg-[var(--primary)]/10 text-[var(--primary)]' },
                { label: 'Browse Events',  href: '/events',                           icon: Globe,        color: 'bg-[var(--accent)]/10 text-[var(--accent)]' },
                { label: 'My Reviews',     href: '/dashboard/reviews',                icon: Star,         color: 'bg-[var(--warning)]/10 text-[var(--warning)]' },
                { label: 'Edit Profile',   href: '/dashboard/settings',               icon: TrendingUp,   color: 'bg-[var(--success)]/10 text-[var(--success)]' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[var(--text)] text-sm font-medium">{label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events you've joined */}
      {participatedEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-[var(--text)]">Events You've Joined</h2>
            <Link href="/events" className="text-xs text-[var(--primary)] flex items-center gap-1 font-medium">
              Browse more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {participatedEvents.map((p: any, i: number) => (
              <EventCard key={p.event.id} event={p.event} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
