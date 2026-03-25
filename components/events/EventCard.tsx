'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, ArrowRight, Lock, Globe, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useLiveCount } from '@/hooks/useAnimations';

interface Event {
  id: string;
  title: string;
  date: string;
  venue?: string;
  eventLink?: string;
  fee: number;
  type: 'PUBLIC' | 'PRIVATE';
  imageUrl?: string;
  category?: string;
  averageRating?: number | null;
  organizer: { id: string; name: string; avatar?: string };
  _count?: { participants: number; reviews: number };
}

interface Props {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: Props) {
  const isPaid = event.fee > 0;
  const isPrivate = event.type === 'PRIVATE';
  const liveCount = useLiveCount(event._count?.participants ?? 0, event.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/events/${event.id}`} className="block group">
        <div className="card card-hover overflow-hidden h-full relative">

          {/* Beam shimmer on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out" />
          </div>

          {/* Image */}
          <div className="relative h-48 bg-[var(--surface-2)] overflow-hidden">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-500 ease-out"
                style={{ '--tw-scale-x': 'var(--scale)', '--tw-scale-y': 'var(--scale)' } as any}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-[var(--primary)]/40" />
              </div>
            )}

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`badge ${isPrivate ? 'badge-private' : 'badge-public'}`}>
                {isPrivate
                  ? <><Lock className="w-2.5 h-2.5" /> Private</>
                  : <><Globe className="w-2.5 h-2.5" /> Public</>
                }
              </span>
              <span className={`badge ${isPaid ? 'badge-paid' : 'badge-free'}`}>
                {isPaid ? `$${event.fee}` : 'Free'}
              </span>
            </div>

            {/* Category */}
            {event.category && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/40 text-white/80 backdrop-blur-sm border border-white/10">
                  {event.category}
                </span>
              </div>
            )}

            {/* Rating overlay bottom */}
            {event.averageRating && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                <span className="text-[var(--warning)] text-xs">★</span>
                <span className="text-white text-xs font-medium">{event.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-display font-semibold text-[var(--text)] text-lg leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200">
              {event.title}
            </h3>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                <Calendar className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
                <span>{format(new Date(event.date), 'MMM d, yyyy · h:mm a')}</span>
              </div>

              {(event.venue || event.eventLink) && (
                <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                  <span className="truncate">{event.venue ?? 'Online Event'}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                <User className="w-3.5 h-3.5 text-[var(--primary-lt)] flex-shrink-0" />
                <span>by <span className="text-[var(--text)] font-medium">{event.organizer.name}</span></span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs">
                <Users className="w-3 h-3" />
                <motion.span
                  key={liveCount}
                  initial={{ scale: 1.2, color: 'var(--success)' }}
                  animate={{ scale: 1, color: 'var(--muted)' }}
                  transition={{ duration: 0.4 }}
                >
                  {liveCount.toLocaleString()}
                </motion.span>
                <span>joined</span>
              </div>

              <div className="flex items-center gap-1 text-[var(--primary)] text-sm font-medium">
                <span className="group-hover:opacity-100 opacity-80 transition-opacity">View</span>
                <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
