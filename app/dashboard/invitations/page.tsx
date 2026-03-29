'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, MapPin, CreditCard, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/invitations/my')
      .then(res => setInvitations(res.data.invitations || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (inv: any) => {
    setActionId(inv.id);
    try {
      if (inv.event.fee > 0) {
        // Modern Stripe SDK: server returns session.url — redirect directly.
        // stripe.redirectToCheckout({ sessionId }) was removed in @stripe/stripe-js v2+.
        const res = await api.post('/payments/create-session', {
          eventId: inv.event.id,
          invitationId: inv.id,
        });

        const checkoutUrl: string | undefined = res.data?.url;
        if (!checkoutUrl) throw new Error('No checkout URL returned from server.');
        window.location.href = checkoutUrl;
      } else {
        await api.patch(`/invitations/${inv.id}/accept`);
        toast.success('Invitation accepted!');
        setInvitations(prev => prev.filter(i => i.id !== inv.id));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setActionId(id);
    try {
      await api.patch(`/invitations/${id}/decline`);
      toast.success('Invitation declined');
      setInvitations(prev => prev.filter(i => i.id !== id));
    } catch {
      toast.error('Failed to decline');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text">Invitations</h1>
        <p className="text-muted mt-1">Events you've been invited to join</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : invitations.length === 0 ? (
        <EmptyState
          icon="✉️"
          title="No pending invitations"
          description="When event organizers invite you, they'll appear here."
        />
      ) : (
        <div className="space-y-4">
          {invitations.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 flex items-center gap-5"
            >
              {inv.event.imageUrl ? (
                <img
                  src={inv.event.imageUrl}
                  alt={inv.event.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-text truncate">
                    {inv.event.title}
                  </h3>
                  {inv.event.fee > 0
                    ? <span className="badge-paid">${inv.event.fee}</span>
                    : <span className="badge-free">Free</span>
                  }
                </div>
                <p className="text-muted text-xs">
                  Invited by <span className="text-text font-medium">{inv.sender.name}</span>
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-muted text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(inv.event.date), 'MMM d, yyyy')}
                  </span>
                  {inv.event.venue && (
                    <span className="text-muted text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {inv.event.venue}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleAccept(inv)}
                  loading={actionId === inv.id}
                  icon={
                    inv.event.fee > 0
                      ? <CreditCard className="w-3.5 h-3.5" />
                      : <Check className="w-3.5 h-3.5" />
                  }
                >
                  {inv.event.fee > 0 ? 'Pay & Accept' : 'Accept'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDecline(inv.id)}
                  disabled={actionId === inv.id}
                  icon={<X className="w-3.5 h-3.5" />}
                >
                  Decline
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}