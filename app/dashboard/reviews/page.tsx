'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Edit, Trash2, Clock } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Button, Modal, Textarea, StarRating, EmptyState, Skeleton } from '@/components/ui';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    api.get('/reviews/my')
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (review: any) => {
    setEditing(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/reviews/${editing.id}`, { rating: editRating, comment: editComment });
      toast.success('Review updated');
      setEditing(null);
      const res = await api.get('/reviews/my');
      setReviews(res.data.reviews || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/reviews/${deleteId}`);
      toast.success('Review deleted');
      setDeleteId(null);
      setReviews(prev => prev.filter(r => r.id !== deleteId));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const canEdit = (review: any) => isAfter(new Date(review.editableUntil), new Date());

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text">My Reviews</h1>
        <p className="text-muted mt-1">Reviews you've written for past events</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          description="After attending events, you can share your experience here."
          action={<Link href="/events"><Button>Browse Events</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {review.event.imageUrl ? (
                    <img src={review.event.imageUrl} alt={review.event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-warning" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link href={`/events/${review.event.id}`} className="font-display font-semibold text-text hover:text-primary transition-colors truncate block">
                      {review.event.title}
                    </Link>
                    <StarRating rating={review.rating} />
                    <p className="text-muted text-sm mt-2 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-muted text-xs">{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                      {canEdit(review) ? (
                        <span className="text-xs text-success flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Editable until {format(new Date(review.editableUntil), 'MMM d h:mm a')}
                        </span>
                      ) : (
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Edit window expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {canEdit(review) && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(review)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(review.id)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-error hover:border-error/50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Review">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-2">Rating</p>
            <StarRating rating={editRating} onRate={setEditRating} interactive />
          </div>
          <Textarea label="Review" value={editComment} onChange={e => setEditComment(e.target.value)} rows={4} />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setEditing(null)} className="flex-1">Cancel</Button>
            <Button onClick={handleUpdate} className="flex-1">Update Review</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Review">
        <p className="text-muted mb-6">Are you sure you want to delete this review?</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
