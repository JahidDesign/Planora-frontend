'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, DollarSign, TrendingUp,
  Trash2, Search, Shield, Eye, Star, BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import { Button, Input, Skeleton, Modal } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { clsx } from 'clsx';

type Tab = 'overview' | 'users' | 'events' | 'blogs';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user?.role !== 'ADMIN') { router.push('/dashboard'); return; }
    fetchData();
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, eventsRes, blogsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/events'),
        api.get('/my-blogs?limit=100'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setEvents(eventsRes.data.events || []);
      setBlogs(blogsRes.data.blogs || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      toast.success('User deleted');
      setDeleteUserId(null);
      setUsers(prev => prev.filter(u => u.id !== deleteUserId));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await api.delete(`/events/${deleteEventId}`);
      toast.success('Event removed');
      setDeleteEventId(null);
      setEvents(prev => prev.filter(e => e.id !== deleteEventId));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleDeleteBlog = async () => {
    try {
      await api.delete(`/my-blogs/${deleteBlogId}`);
      toast.success('Blog post deleted');
      setDeleteBlogId(null);
      setBlogs(prev => prev.filter(b => b.id !== deleteBlogId));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleSetFeatured = async (eventId: string) => {
    try {
      await api.patch(`/admin/events/${eventId}/feature`);
      toast.success('Featured event updated!');
      fetchData();
    } catch {
      toast.error('Failed');
    }
  };

  const handleSetBlogFeatured = async (id: string, current: boolean) => {
    try {
      await api.patch(`/my-blogs/${id}/featured`, { isFeatured: !current });
      toast.success(!current ? '⭐ Set as featured' : 'Removed from featured');
      setBlogs(prev => prev.map(b => b.id === id ? { ...b, isFeatured: !current } : b));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success('Role updated');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch {
      toast.error('Failed');
    }
  };

  // ── Filtered lists ─────────────────────────────────────────────────────────

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer?.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stat cards ─────────────────────────────────────────────────────────────

  const statCards = stats ? [
    { label: 'Total Users', value: stats.stats.totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Events', value: stats.stats.totalEvents, icon: CalendarDays, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Participants', value: stats.stats.totalParticipants, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Revenue', value: `$${stats.stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10' },
  ] : [];

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 bg-background">

        {/* Header */}
        <div className="bg-surface border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-text">Admin Panel</h1>
            </div>
            <p className="text-muted">Monitor and manage the entire Planora platform</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Stat cards */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                  </div>
                  <p className="font-display text-3xl font-bold text-text">{value}</p>
                  <p className="text-muted text-xs mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-surface p-1 rounded-xl border border-border w-fit">
            {(['overview', 'users', 'events', 'blogs'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(''); }}
                className={clsx(
                  'px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200',
                  tab === t
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-muted hover:text-text'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          {tab !== 'overview' && (
            <div className="mb-5 max-w-md">
              <Input
                placeholder={`Search ${tab}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          )}

          {/* ── Overview Tab ── */}
          {tab === 'overview' && !loading && stats && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="card p-6">
                <h3 className="font-display font-semibold text-text mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recentUsers?.map((u: any) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text text-sm font-medium truncate">{u.name}</p>
                        <p className="text-muted text-xs truncate">{u.email}</p>
                      </div>
                      <span className={u.role === 'ADMIN' ? 'badge-private' : 'badge-public text-xs'}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTab('users')} className="mt-4 text-primary text-sm hover:underline">
                  View all users →
                </button>
              </div>

              {/* Recent Events */}
              <div className="card p-6">
                <h3 className="font-display font-semibold text-text mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {stats.recentEvents?.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-text text-sm font-medium truncate">{e.title}</p>
                        <p className="text-muted text-xs">by {e.organizer.name} · {e._count.participants} joined</p>
                      </div>
                      <Link href={`/events/${e.id}`}>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-accent transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTab('events')} className="mt-4 text-primary text-sm hover:underline">
                  View all events →
                </button>
              </div>
            </div>
          )}

          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="card p-16 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted opacity-30" />
                  <p className="text-muted">No users found</p>
                </div>
              ) : filteredUsers.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {u.avatar
                      ? <img src={u.avatar} className="w-full h-full rounded-full object-cover" />
                      : u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text text-sm font-semibold">{u.name}</p>
                    <p className="text-muted text-xs">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                      <span>{u._count.eventsCreated} events</span>
                      <span>·</span>
                      <span>{u._count.participations} participations</span>
                      <span>·</span>
                      <span>Joined {format(new Date(u.createdAt), 'MMM yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={u.role}
                      onChange={e => handleRoleUpdate(u.id, e.target.value)}
                      className="bg-surface-2 border border-border text-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    {u.id !== user?.id && (
                      <button
                        onClick={() => setDeleteUserId(u.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Events Tab ── */}
          {tab === 'events' && (
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="card p-16 text-center">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted opacity-30" />
                  <p className="text-muted">No events found</p>
                </div>
              ) : filteredEvents.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 flex items-center gap-4"
                >
                  {e.imageUrl ? (
                    <img src={e.imageUrl} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-text text-sm font-semibold truncate">{e.title}</p>
                      {e.isFeatured && <span className="badge-paid text-xs">⭐ Featured</span>}
                    </div>
                    <p className="text-muted text-xs mt-0.5">
                      by {e.organizer.name} · {format(new Date(e.date), 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={e.type === 'PRIVATE' ? 'badge-private' : 'badge-public'}>{e.type}</span>
                      <span className={e.fee > 0 ? 'badge-paid' : 'badge-free'}>{e.fee > 0 ? `$${e.fee}` : 'Free'}</span>
                      <span className="text-muted text-xs">{e._count.participants} participants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSetFeatured(e.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors"
                      title="Toggle featured"
                    >
                      <Star className={`w-4 h-4 ${e.isFeatured ? 'text-warning fill-warning' : ''}`} />
                    </button>
                    <Link href={`/events/${e.id}`}>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-accent transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteEventId(e.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Blogs Tab ── */}
          {tab === 'blogs' && (
            <div className="space-y-3">
              {filteredBlogs.length === 0 ? (
                <div className="card p-16 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted opacity-30" />
                  <p className="text-muted">No blog posts found</p>
                </div>
              ) : filteredBlogs.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  {b.imageUrl ? (
                    <img src={b.imageUrl} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-text text-sm font-semibold truncate">{b.title}</p>
                      {b.isFeatured && <span className="badge-paid text-xs">⭐ Featured</span>}
                    </div>
                    <p className="text-muted text-xs mt-0.5">
                      by {b.author.name} · {format(new Date(b.publishedAt || b.createdAt), 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {b.category && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/30">
                          {b.category}
                        </span>
                      )}
                      <span className={b.isPublished ? 'badge-public' : 'badge-private'}>
                        {b.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {b.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-muted text-xs">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSetBlogFeatured(b.id, b.isFeatured)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors"
                      title={b.isFeatured ? 'Remove featured' : 'Set as featured'}
                    >
                      <Star className={`w-4 h-4 ${b.isFeatured ? 'text-warning fill-warning' : ''}`} />
                    </button>
                    <Link href={`/blogs/${b.slug}`}>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-accent transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteBlogId(b.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete User Modal ── */}
      <Modal isOpen={!!deleteUserId} onClose={() => setDeleteUserId(null)} title="Delete User Account">
        <p className="text-muted mb-6">
          This will permanently delete the user and all their data. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteUserId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Delete User
          </Button>
        </div>
      </Modal>

      {/* ── Delete Event Modal ── */}
      <Modal isOpen={!!deleteEventId} onClose={() => setDeleteEventId(null)} title="Remove Event">
        <p className="text-muted mb-6">
          This event will be removed from the platform. Organizer will be notified.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteEventId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteEvent} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Remove Event
          </Button>
        </div>
      </Modal>

      {/* ── Delete Blog Modal ── */}
      <Modal isOpen={!!deleteBlogId} onClose={() => setDeleteBlogId(null)} title="Delete Blog Post">
        <p className="text-muted mb-6">
          Are you sure you want to delete this blog post? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteBlogId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDeleteBlog} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Delete Post
          </Button>
        </div>
      </Modal>
    </>
  );
}