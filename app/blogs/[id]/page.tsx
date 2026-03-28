'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Edit, Trash2, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Modal, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [blog, setBlog] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      // ✅ Fixed: /:slug hits GET /api/my-blogs/:slug → getBlog controller
      const res = await api.get(`/my-blogs/${slug}`);
      const fetchedBlog = res.data.blog;
      setBlog(fetchedBlog);

      // ✅ Fixed: related posts use / (getBlogs), not /my-blogs sub-route
      if (fetchedBlog.category) {
        const rel = await api.get(`/my-blogs?category=${fetchedBlog.category}&limit=4`);
        setRelated((rel.data.blogs || []).filter((b: any) => b.slug !== slug));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Post not found');
      router.push('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // ✅ Fixed: delete by blog.id (not slug) → DELETE /api/my-blogs/:id
      await api.delete(`/my-blogs/${blog.id}`);
      toast.success('Post deleted');
      router.push('/blogs');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const isAuthor = blog && user && blog.author.id === user.id;
  const isAdmin = user?.role === 'ADMIN';

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-72 rounded-2xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Footer />
    </>
  );

  if (!blog) return null;

  const mins = readingTime(blog.content);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-4 gap-10">

            {/* Main article */}
            <article className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] text-sm mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                {/* Category + featured badge */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {blog.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                      {blog.category}
                    </span>
                  )}
                  {blog.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight mb-6">
                  {blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                      {blog.author.avatar
                        ? <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
                        : blog.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[var(--text)] text-sm font-semibold">{blog.author.name}</p>
                      <p className="text-[var(--muted)] text-xs">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--muted)] text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(blog.publishedAt || blog.createdAt), 'MMM d, yyyy')}
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--muted)] text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {mins} min read
                  </div>
                </div>

                {/* Hero image */}
                {blog.imageUrl && (
                  <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-[var(--surface-2)]">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/40 to-transparent" />
                  </div>
                )}

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-lg text-[var(--muted)] leading-relaxed italic border-l-4 border-[var(--primary)]/40 pl-5 mb-8 bg-[var(--surface-2)] py-4 pr-4 rounded-r-xl">
                    {blog.excerpt}
                  </p>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  {blog.content.split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i} className="text-[var(--muted)] leading-relaxed mb-5 text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-[var(--muted)]" />
                      {blog.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors cursor-default"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author card */}
                <div className="mt-10 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-xl font-bold text-white flex-shrink-0 overflow-hidden">
                    {blog.author.avatar
                      ? <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
                      : blog.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[var(--text)] font-semibold text-base">{blog.author.name}</p>
                    {blog.author.bio && (
                      <p className="text-[var(--muted)] text-sm mt-1 leading-relaxed">{blog.author.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">

              {/* Owner / Admin controls */}
              {(isAuthor || isAdmin) && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sticky top-24">
                  <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider mb-3">
                    {isAuthor ? 'Author Controls' : 'Admin Controls'}
                  </p>
                  <div className="space-y-2">
                    {(isAuthor || isAdmin) && (
                      <Link href={`/blogs/${slug}/edit`}>
                        <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-4 h-4" />}>
                          Edit Post
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Post
                    </Button>
                  </div>
                </div>
              )}

              {/* Related posts */}
              {related.length > 0 && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                  <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider mb-4">
                    Related Posts
                  </p>
                  <div className="space-y-4">
                    {related.map((rel: any) => (
                      <Link key={rel.id} href={`/blogs/${rel.slug}`} className="group block">
                        <div className="flex gap-3">
                          {rel.imageUrl && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface-2)]">
                              <img
                                src={rel.imageUrl}
                                alt={rel.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[var(--text)] text-sm font-medium line-clamp-2 group-hover:text-[var(--primary)] transition-colors leading-snug">
                              {rel.title}
                            </p>
                            <p className="text-[var(--muted)] text-xs mt-1">
                              {format(new Date(rel.publishedAt || rel.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider mb-4">Post Info</p>
                <div className="space-y-3">
                  {[
                    { icon: Clock, label: 'Read time', value: `${mins} min` },
                    { icon: Calendar, label: 'Published', value: format(new Date(blog.publishedAt || blog.createdAt), 'MMM d, yyyy') },
                    { icon: Tag, label: 'Category', value: blog.category || '—' },
                    { icon: BookOpen, label: 'Tags', value: blog.tags?.length ? `${blog.tags.length} tags` : '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </div>
                      <span className="text-[var(--text)] font-medium text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Post">
        <p className="text-[var(--muted)] mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-[var(--text)]">"{blog?.title}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Delete Post
          </Button>
        </div>
      </Modal>
    </>
  );
}