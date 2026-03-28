'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Input, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Business', 'Design', 'Health', 'Education', 'Career'];

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogId, setBlogId] = useState<string>('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    api.get(`/my-blogs/${slug}`)
      .then(res => {
        const b = res.data.blog;
        if (b.author.id !== user?.id && user?.role !== 'ADMIN') {
          toast.error('Not authorized to edit this post');
          router.push(`/blogs/${slug}`);
          return;
        }
        setBlogId(b.id);
        setValue('title', b.title);
        setValue('excerpt', b.excerpt || '');
        setValue('content', b.content);
        setValue('category', b.category || '');
        setValue('imageUrl', b.imageUrl || '');
        setValue('tags', b.tags?.join(', ') || '');
      })
      .catch(() => router.push('/blogs'))
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const tags = data.tags
        ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
      await api.put(`/my-blogs/${blogId}`, { ...data, tags });
      toast.success('Post updated successfully!');
      router.push(`/blogs/${slug}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update post');
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
            <Link
              href={`/blogs/${slug}`}
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Post
            </Link>

            <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Edit Post</h1>
            <p className="text-[var(--muted)] mb-8">Update the details for your blog post</p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Post Title *"
                  placeholder="e.g. The Complete Guide to React Server Components"
                  error={errors.title?.message as string}
                  {...register('title', { required: 'Title is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Excerpt <span className="text-[var(--muted)] font-normal">(short summary)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A brief description shown in listings..."
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all duration-200"
                    {...register('excerpt')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Content *</label>
                  <textarea
                    rows={14}
                    placeholder="Write your post content here..."
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all duration-200"
                    {...register('content', { required: 'Content is required' })}
                  />
                  {errors.content && (
                    <p className="mt-1.5 text-xs text-[var(--error)]">{errors.content.message as string}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Category</label>
                    <select
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all duration-200"
                      {...register('category')}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input
                    label="Tags"
                    placeholder="React, Next.js, TypeScript"
                    {...register('tags')}
                  />
                </div>

                <Input
                  label="Cover Image URL"
                  placeholder="https://images.unsplash.com/..."
                  {...register('imageUrl')}
                />

                {user?.role === 'ADMIN' && (
                  <div className="flex items-center gap-3 p-4 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      className="accent-[var(--primary)] w-4 h-4"
                      {...register('isFeatured')}
                    />
                    <label htmlFor="isFeatured" className="text-[var(--text)] text-sm font-medium cursor-pointer">
                      ⭐ Set as Featured Post (Admin only)
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Link href={`/blogs/${slug}`} className="flex-1">
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