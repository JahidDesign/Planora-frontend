'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Eye, CalendarDays, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Input, Textarea, Select, Modal, Badge, EmptyState, Skeleton } from '@/components/ui';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { clsx } from 'clsx';

interface EventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  eventLink: string;
  type: 'PUBLIC' | 'PRIVATE';
  fee: number;
  capacity: string;
  imageUrl: string;
  category: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'badge-pending',
  APPROVED: 'badge-approved',
  REJECTED: 'badge-rejected',
  BANNED: 'badge-banned',
};

export default function MyEventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(searchParams.get('create') === 'true');
  const [editEvent, setEditEvent] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingList, setPendingList] = useState<{ event: any; participants: any[] } | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EventForm>();

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (editEvent) {
      const d = new Date(editEvent.date);
      setValue('title', editEvent.title);
      setValue('description', editEvent.description);
      setValue('date', format(d, 'yyyy-MM-dd'));
      setValue('time', format(d, 'HH:mm'));
      setValue('venue', editEvent.venue || '');
      setValue('eventLink', editEvent.eventLink || '');
      setValue('type', editEvent.type);
      setValue('fee', editEvent.fee);
      setValue('capacity', editEvent.capacity?.toString() || '');
      setValue('imageUrl', editEvent.imageUrl || '');
      setValue('category', editEvent.category || '');
      setShowModal(true);
    }
  }, [editEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/my-events');
      setEvents(res.data.events || []);
    } catch { } finally { setLoading(false); }
  };

  const fetchPendingParticipants = async (event: any) => {
    try {
      const res = await api.get(`/events/${event.id}/participants`);
      setPendingList({ event, participants: res.data.participants || [] });
    } catch { toast.error('Failed to load participants'); }
  };

  const onSubmit = async (data: EventForm) => {
    setSubmitting(true);
    try {
      const dateTime = new Date(`${data.date}T${data.time || '00:00'}`);
      const payload = {
        ...data,
        date: dateTime.toISOString(),
        fee: parseFloat(String(data.fee)) || 0,
        capacity: data.capacity ? parseInt(data.capacity) : null,
      };

      if (editEvent) {
        await api.put(`/events/${editEvent.id}`, payload);
        toast.success('Event updated!');
      } else {
        await api.post('/events', payload);
        toast.success('Event created! 🎉');
      }
      setShowModal(false);
      setEditEvent(null);
      reset();
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save event');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/events/${deleteId}`);
      toast.success('Event deleted');
      setDeleteId(null);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleParticipantAction = async (pid: string, action: 'approve' | 'reject' | 'ban') => {
    try {
      await api.patch(`/participants/${pid}/${action}`);
      toast.success(`Participant ${action}d`);
      if (pendingList) fetchPendingParticipants(pendingList.event);
    } catch { toast.error('Action failed'); }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">My Events</h1>
          <p className="text-muted mt-1">Manage all events you've created</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setEditEvent(null); reset(); setShowModal(true); }}>
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search your events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events yet"
          description="Create your first event and start bringing people together."
          action={
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
              Create Event
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-text truncate">{event.title}</h3>
                  <p className="text-muted text-xs mt-0.5">{format(new Date(event.date), 'MMM d, yyyy')}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={event.type === 'PRIVATE' ? 'badge-private' : 'badge-public'}>{event.type}</span>
                    <span className={event.fee > 0 ? 'badge-paid' : 'badge-free'}>
                      {event.fee > 0 ? `$${event.fee}` : 'Free'}
                    </span>
                    {event.participants?.length > 0 && (
                      <span className="badge-pending">{event.participants.length} pending</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-muted text-sm flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {event._count?.participants || 0}
                </span>

                {event.participants?.length > 0 && (
                  <Button size="sm" variant="accent" onClick={() => fetchPendingParticipants(event)}>
                    Review ({event.participants.length})
                  </Button>
                )}
                <Link href={`/events/${event.id}`}>
                  <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={() => setEditEvent(event)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(event.id)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-error hover:border-error/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditEvent(null); reset(); }}
        title={editEvent ? 'Edit Event' : 'Create New Event'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Event Title *" placeholder="e.g. Next.js Summit 2025" error={errors.title?.message}
            {...register('title', { required: 'Title is required' })} />

          <Textarea label="Description *" rows={4} placeholder="Tell people what this event is about..."
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date *" type="date" error={errors.date?.message}
              {...register('date', { required: 'Date is required' })} />
            <Input label="Time" type="time" {...register('time')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Event Type" {...register('type')}>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </Select>
            <Input label="Registration Fee ($)" type="number" min="0" step="0.01" placeholder="0 for free"
              {...register('fee')} />
          </div>

          <Input label="Venue" placeholder="e.g. San Francisco Convention Center" {...register('venue')} />
          <Input label="Event Link (optional)" placeholder="https://zoom.us/..." {...register('eventLink')} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity (optional)" type="number" min="1" placeholder="Unlimited"
              {...register('capacity')} />
            <Input label="Category" placeholder="Technology, Business..." {...register('category')} />
          </div>

          <Input label="Image URL (optional)" placeholder="https://images.unsplash.com/..."
            {...register('imageUrl')} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowModal(false); setEditEvent(null); reset(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              {editEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Event">
        <p className="text-muted mb-6">This event will be permanently deleted. Are you sure?</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Pending Participants Modal */}
      <Modal isOpen={!!pendingList} onClose={() => setPendingList(null)}
        title={`Participants — ${pendingList?.event.title}`} maxWidth="max-w-2xl">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pendingList?.participants.length === 0 ? (
            <p className="text-center text-muted py-8">No participants yet</p>
          ) : pendingList?.participants.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                  {p.user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-text text-sm font-medium">{p.user.name}</p>
                  <p className="text-muted text-xs">{p.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={STATUS_COLORS[p.status] || 'text-muted text-xs'}>{p.status}</span>
                {p.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleParticipantAction(p.id, 'approve')}
                      className="px-3 py-1 bg-success/20 text-success text-xs rounded-lg hover:bg-success/30 transition-colors">
                      Approve
                    </button>
                    <button onClick={() => handleParticipantAction(p.id, 'reject')}
                      className="px-3 py-1 bg-error/20 text-error text-xs rounded-lg hover:bg-error/30 transition-colors">
                      Reject
                    </button>
                  </>
                )}
                {p.status === 'APPROVED' && (
                  <button onClick={() => handleParticipantAction(p.id, 'ban')}
                    className="px-3 py-1 bg-red-900/30 text-red-400 text-xs rounded-lg hover:bg-red-900/50 transition-colors">
                    Ban
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
