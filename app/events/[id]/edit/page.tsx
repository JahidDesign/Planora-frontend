'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Input, Textarea, Select, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<any>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(res => {
        const e = res.data.event;
        if (e.organizer.id !== user?.id && user?.role !== 'ADMIN') {
          toast.error('Not authorized to edit this event');
          router.push(`/events/${id}`);
          return;
        }
        setEvent(e);
        const d = new Date(e.date);
        setValue('title', e.title);
        setValue('description', e.description);
        setValue('date', format(d, 'yyyy-MM-dd'));
        setValue('time', format(d, 'HH:mm'));
        setValue('venue', e.venue || '');
        setValue('eventLink', e.eventLink || '');
        setValue('type', e.type);
        setValue('fee', e.fee);
        setValue('capacity', e.capacity?.toString() || '');
        setValue('imageUrl', e.imageUrl || '');
        setValue('category', e.category || '');
      })
      .catch(() => router.push('/events'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const dateTime = new Date(`${data.date}T${data.time || '00:00'}`);
      await api.put(`/events/${id}`, {
        ...data,
        date: dateTime.toISOString(),
        fee: parseFloat(data.fee) || 0,
        capacity: data.capacity ? parseInt(data.capacity) : null,
      });
      toast.success('Event updated successfully!');
      router.push(`/events/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href={`/events/${id}`}
              className="inline-flex items-center gap-2 text-muted hover:text-text text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Event
            </Link>

            <h1 className="font-display text-3xl font-bold text-text mb-2">Edit Event</h1>
            <p className="text-muted mb-8">Update the details for your event</p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input label="Event Title *" placeholder="e.g. Next.js Summit 2025"
                  error={errors.title?.message as string}
                  {...register('title', { required: 'Title is required' })} />

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Description *</label>
                  <textarea
                    rows={5}
                    placeholder="Tell people what this event is about..."
                    className="w-full bg-surface-2 border border-border text-text placeholder-muted rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && <p className="mt-1.5 text-xs text-error">{errors.description.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date *" type="date"
                    error={errors.date?.message as string}
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
                  <Input label="Capacity (optional)" type="number" min="1" placeholder="Unlimited" {...register('capacity')} />
                  <Input label="Category" placeholder="Technology, Business..." {...register('category')} />
                </div>

                <Input label="Image URL" placeholder="https://images.unsplash.com/..." {...register('imageUrl')} />

                {user?.role === 'ADMIN' && (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <input type="checkbox" id="isFeatured" className="accent-primary w-4 h-4" {...register('isFeatured')} />
                    <label htmlFor="isFeatured" className="text-text text-sm font-medium cursor-pointer">
                      ⭐ Set as Featured Event (Admin only)
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Link href={`/events/${id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Cancel</Button>
                  </Link>
                  <Button type="submit" loading={saving} className="flex-1" icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
