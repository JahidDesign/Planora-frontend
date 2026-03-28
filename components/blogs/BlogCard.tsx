'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt: string;
  author: { id: string; name: string; avatar?: string };
}

interface Props {
  blog: Blog;
  index?: number;
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogCard({ blog, index = 0 }: Props) {
  const mins = readingTime(blog.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blogs/${blog.slug}`} className="block group">
        <div className="card card-hover overflow-hidden h-full relative">

          {/* Beam shimmer */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out" />
          </div>

          {/* Image */}
          <div className="relative h-48 bg-[var(--surface-2)] overflow-hidden">
            {blog.imageUrl ? (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                <span className="text-4xl opacity-30">📝</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent" />

            {/* Category badge */}
            {blog.category && (
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--accent)]/80 text-white backdrop-blur-sm">
                  {blog.category}
                </span>
              </div>
            )}

            {/* Featured badge */}
            {blog.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--warning)]/80 text-white backdrop-blur-sm">
                  ⭐ Featured
                </span>
              </div>
            )}

            {/* Read time */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-white/70" />
              <span className="text-white text-xs font-medium">{mins} min</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-display font-semibold text-[var(--text)] text-lg leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="mt-2 text-[var(--muted)] text-sm leading-relaxed line-clamp-2">
                {blog.excerpt}
              </p>
            )}

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                <User className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
                <span>by <span className="text-[var(--text)] font-medium">{blog.author.name}</span></span>
              </div>
              <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                <span>{format(new Date(blog.publishedAt || blog.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>

            {/* Tags preview */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {blog.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]">
                    #{tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-[10px] text-[var(--muted)]">+{blog.tags.length - 3}</span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[var(--muted)] text-xs">
                <Tag className="w-3 h-3" />
                <span>{blog.category || 'General'}</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--primary)] text-sm font-medium">
                <span className="group-hover:opacity-100 opacity-80 transition-opacity">Read</span>
                <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}