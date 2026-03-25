'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, User, Users, Lock, Globe, Tag, Star,
  Edit, Trash2, UserCheck, UserX, Ban, Link as LinkIcon,
  CreditCard, Send, MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Modal, Textarea, StarRating, Badge, Skeleton } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [event, setEvent] = useState<any>(null);
  const [userParticipation, setUserParticipation] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.event);
      setUserParticipation(res.data.userParticipation);

      const reviewsRes = await api.get(`/reviews/event/${id}`);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Event not found');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await api.get(`/events/${id}/participants`);
      setParticipants(res.data.participants || []);
    } catch {}
  };

  const isOwner = event && user && event.organizer.id === user.id;
  const isAdmin = user?.role === 'ADMIN';
  const isPast = event && new Date(event.date) < new Date();

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join events');
      router.push('/auth/login');
      return;
    }
    setActionLoading(true);
    try {
      if (event.fee > 0) {
        // Redirect to Stripe checkout
        const res = await api.post('/payments/create-session', { eventId: id });
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
      } else {
        await api.post(`/participants/join/${id}`);
        toast.success(event.type === 'PUBLIC' ? '🎉 Joined successfully!' : 'Request sent! Awaiting approval.');
        fetchEvent();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to join event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleParticipantAction = async (participantId: string, action: 'approve' | 'reject' | 'ban') => {
    try {
      await api.patch(`/participants/${participantId}/${action}`);
      toast.success(`Participant ${action}d`);
      fetchParticipants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await api.post('/reviews', { eventId: id, rating, comment });
      toast.success('Review submitted!');
      setShowReviewModal(false);
      fetchEvent();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleInvite = async () => {
    try {
      await api.post('/invitations', { eventId: id, receiverEmail: inviteEmail });
      toast.success('Invitation sent!');
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send invitation');
    }
  };

  const getJoinButton = () => {
    if (!isAuthenticated) return (
      <Button onClick={handleJoin} size="lg" className="w-full">
        Login to Join
      </Button>
    );
    if (isOwner) return null;
    if (!userParticipation) {
      const isPaid = event.fee > 0;
      const isPrivate = event.type === 'PRIVATE';
      let label = 'Join Free';
      if (isPaid && !isPrivate) label = `Pay & Join — $${event.fee}`;
      if (!isPaid && isPrivate) label = 'Request to Join';
      if (isPaid && isPrivate) label = `Pay & Request — $${event.fee}`;
      return (
        <Button onClick={handleJoin} loading={actionLoading} size="lg" className="w-full"
          icon={isPaid ? <CreditCard className="w-4 h-4" /> : undefined}>
          {label}
        </Button>
      );
    }
    const statusMap: Record<string, { label: string; variant: any }> = {
      PENDING: { label: '⏳ Pending Approval', variant: 'outline' },
      APPROVED: { label: '✅ You\'re In!', variant: 'outline' },
      REJECTED: { label: '❌ Request Rejected', variant: 'danger' },
      BANNED: { label: '🚫 You\'ve Been Banned', variant: 'danger' },
    };
    const s = statusMap[userParticipation.status];
    return <Button variant={s.variant} size="lg" className="w-full" disabled>{s.label}</Button>;
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <Skeleton className="h-72 rounded-2xl mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  if (!event) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero image */}
        <div className="relative h-72 sm:h-96 bg-surface-2 overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Badges overlay */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 flex-wrap">
            <span className={event.type === 'PRIVATE' ? 'badge-private' : 'badge-public'}>
              {event.type === 'PRIVATE' ? <Lock className="w-3 h-3 inline mr-1" /> : <Globe className="w-3 h-3 inline mr-1" />}
              {event.type}
            </span>
            <span className={event.fee > 0 ? 'badge-paid' : 'badge-free'}>
              {event.fee > 0 ? `$${event.fee}` : 'FREE'}
            </span>
            {event.category && (
              <span className="bg-background/80 text-muted text-xs px-2.5 py-1 rounded-full border border-border backdrop-blur-sm">
                {event.category}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-text leading-tight">
                  {event.title}
                </h1>

                {event.averageRating && (
                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={Math.round(event.averageRating)} />
                    <span className="text-muted text-sm">
                      {event.averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}

                {/* Event meta */}
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, label: 'Date & Time', value: format(new Date(event.date), 'EEEE, MMMM d, yyyy · h:mm a'), color: 'text-primary' },
                    { icon: MapPin, label: 'Location', value: event.venue || 'Online Event', color: 'text-accent' },
                    { icon: User, label: 'Organizer', value: event.organizer.name, color: 'text-primary-light' },
                    { icon: Users, label: 'Participants', value: `${event._count.participants} registered`, color: 'text-success' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border">
                      <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium">{label}</p>
                        <p className="text-text text-sm mt-0.5 font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {event.eventLink && (
                  <a href={event.eventLink} target="_blank" rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-accent text-sm hover:underline">
                    <LinkIcon className="w-4 h-4" /> {event.eventLink}
                  </a>
                )}
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold text-text mb-4">About This Event</h2>
                <p className="text-muted leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </motion.div>

              {/* Approved Participants preview */}
              {event.participants?.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-text">Attendees</h2>
                    <span className="text-muted text-sm">{event.participants.length} confirmed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.participants.slice(0, 8).map((p: any) => (
                      <div key={p.id} title={p.user.name}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white border-2 border-surface">
                        {p.user.avatar
                          ? <img src={p.user.avatar} alt={p.user.name} className="w-full h-full rounded-full object-cover" />
                          : p.user.name.charAt(0)}
                      </div>
                    ))}
                    {event.participants.length > 8 && (
                      <div className="w-10 h-10 rounded-full bg-surface-2 border-2 border-surface flex items-center justify-center text-xs text-muted">
                        +{event.participants.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-text">
                    Reviews <span className="text-muted text-base font-normal">({reviews.length})</span>
                  </h2>
                  {isAuthenticated && isPast && userParticipation?.status === 'APPROVED' && (
                    <Button size="sm" variant="outline" icon={<Star className="w-3.5 h-3.5" />}
                      onClick={() => setShowReviewModal(true)}>
                      Write Review
                    </Button>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-muted">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="flex gap-4 p-4 bg-surface-2 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {review.user.avatar
                            ? <img src={review.user.avatar} className="w-full h-full rounded-full object-cover" />
                            : review.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-text text-sm">{review.user.name}</span>
                            <span className="text-muted text-xs">{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          <StarRating rating={review.rating} />
                          <p className="text-muted text-sm mt-2 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Join Card */}
              <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
                <div className="mb-5">
                  <p className="text-muted text-sm">Registration Fee</p>
                  <p className="font-display text-3xl font-bold mt-1">
                    {event.fee > 0 ? (
                      <span className="gradient-text">${event.fee}</span>
                    ) : (
                      <span className="text-success">Free</span>
                    )}
                  </p>
                </div>

                {isPast ? (
                  <div className="w-full py-3 text-center text-muted bg-surface-2 rounded-xl border border-border text-sm">
                    This event has ended
                  </div>
                ) : (
                  getJoinButton()
                )}

                {isOwner && (
                  <div className="mt-4 space-y-2 pt-4 border-t border-border">
                    <p className="text-xs text-muted font-medium uppercase tracking-wider mb-3">Owner Controls</p>
                    <Link href={`/events/${id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-4 h-4" />}>
                        Edit Event
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" icon={<Users className="w-4 h-4" />}
                      onClick={() => { fetchParticipants(); setShowParticipantsModal(true); }}>
                      Manage Participants
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full" icon={<Send className="w-4 h-4" />}
                      onClick={() => setShowInviteModal(true)}>
                      Send Invitations
                    </Button>
                    <Button variant="danger" size="sm" className="w-full" icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteModal(true)}>
                      Delete Event
                    </Button>
                  </div>
                )}

                {isAdmin && !isOwner && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">Admin Controls</p>
                    <Button variant="danger" size="sm" className="w-full" icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setShowDeleteModal(true)}>
                      Remove Event
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Event">
        <p className="text-muted mb-6">Are you sure you want to delete <strong className="text-text">"{event?.title}"</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1" icon={<Trash2 className="w-4 h-4" />}>
            Delete Event
          </Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-2">Your Rating</p>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <Textarea label="Your Review" value={comment} onChange={e => setComment(e.target.value)}
            rows={4} placeholder="Share your experience..." />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowReviewModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmitReview} className="flex-1" disabled={!comment.trim()}>
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Participants Modal */}
      <Modal isOpen={showParticipantsModal} onClose={() => setShowParticipantsModal(false)}
        title="Manage Participants" maxWidth="max-w-2xl">
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {participants.length === 0 ? (
            <p className="text-center text-muted py-8">No participants yet</p>
          ) : participants.map((p: any) => (
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
                <span className={`badge-${p.status.toLowerCase()}`}>{p.status}</span>
                {p.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleParticipantAction(p.id, 'approve')}
                      className="w-8 h-8 rounded-lg bg-success/20 text-success hover:bg-success/30 flex items-center justify-center transition-colors">
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleParticipantAction(p.id, 'reject')}
                      className="w-8 h-8 rounded-lg bg-error/20 text-error hover:bg-error/30 flex items-center justify-center transition-colors">
                      <UserX className="w-4 h-4" />
                    </button>
                  </>
                )}
                {p.status === 'APPROVED' && (
                  <button onClick={() => handleParticipantAction(p.id, 'ban')}
                    className="w-8 h-8 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 flex items-center justify-center transition-colors">
                    <Ban className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Send Invitation">
        <div className="space-y-4">
          <p className="text-muted text-sm">Invite someone by their email address.</p>
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="friend@example.com"
            className="w-full bg-surface-2 border border-border text-text placeholder-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowInviteModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleInvite} className="flex-1" disabled={!inviteEmail} icon={<Send className="w-4 h-4" />}>
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
