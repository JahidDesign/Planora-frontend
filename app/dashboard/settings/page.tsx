'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);

  const profileForm = useForm({
    defaultValues: { name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' },
  });
  const passwordForm = useForm<{ current: string; newPw: string; confirm: string }>();
  const newPw = passwordForm.watch('newPw');
  const avatarPreview = profileForm.watch('avatar');

  const onProfileSave = async (data: any) => {
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', { ...data, notificationsEnabled: notifications });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setSavingProfile(false); }
  };

  const onPasswordSave = async (data: any) => {
    setSavingPassword(true);
    try {
      await api.put('/users/change-password', { currentPassword: data.current, newPassword: data.newPw });
      toast.success('Password changed!');
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setSavingPassword(false); }
  };

  const Section = ({ icon: Icon, title, subtitle, children, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
    >
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[var(--text)]">{title}</h2>
          <p className="text-[var(--muted)] text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--text)]">Settings</h1>
        <p className="text-[var(--muted)] mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-5 max-w-2xl">
        {/* Profile */}
        <Section icon={User} title="Profile Information" subtitle="Update your public profile" delay={0}>
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold text-white overflow-hidden ring-2 ring-[var(--primary)]/30">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                ) : (
                  user?.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-bg border-2 border-[var(--surface)] flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">✏</span>
              </div>
            </div>
            <div className="flex-1">
              <Input
                label="Avatar URL"
                placeholder="https://..."
                {...profileForm.register('avatar')}
              />
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <Input
              label="Full Name"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name', { required: 'Name is required' })}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Bio</label>
              <textarea
                rows={3}
                placeholder="Tell people about yourself..."
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted-2)] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/25 transition-all duration-200"
                {...profileForm.register('bio')}
              />
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[var(--text)] text-sm font-medium">Email Notifications</p>
                  <p className="text-[var(--muted)] text-xs">Receive event updates and invitations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  notifications ? 'bg-[var(--primary)]' : 'bg-[var(--border-2)]'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow"
                />
              </button>
            </div>

            <Button type="submit" loading={savingProfile} icon={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
          </form>
        </Section>

        {/* Password */}
        <Section icon={Lock} title="Change Password" subtitle="Keep your account secure" delay={0.08}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSave)} className="space-y-4">
            <Input
              label="Current Password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              iconRight={
                <button type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={passwordForm.formState.errors.current?.message}
              {...passwordForm.register('current', { required: 'Current password required' })}
            />
            <Input
              label="New Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              error={passwordForm.formState.errors.newPw?.message}
              {...passwordForm.register('newPw', {
                required: 'New password required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
            <Input
              label="Confirm New Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat new password"
              error={passwordForm.formState.errors.confirm?.message}
              {...passwordForm.register('confirm', {
                required: 'Please confirm',
                validate: v => v === newPw || 'Passwords do not match',
              })}
            />
            <Button type="submit" loading={savingPassword} variant="outline" icon={<Lock className="w-4 h-4" />}>
              Update Password
            </Button>
          </form>
        </Section>

        {/* Account Info */}
        <Section icon={Shield} title="Account Information" subtitle="Read-only account details" delay={0.16}>
          <div className="space-y-3">
            {[
              { label: 'Email Address', value: user?.email },
              { label: 'Account Role',  value: user?.role },
              { label: 'Plan',          value: 'Free' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--muted)] text-sm">{label}</span>
                <span className="text-[var(--text)] text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
