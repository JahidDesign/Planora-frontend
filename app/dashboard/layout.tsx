'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Mail, Star, Settings, ChevronRight,
  Zap, LayoutDashboard, LogOut, Menu, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const sidebarLinks = [
  { href: '/dashboard',             label: 'Overview',     icon: LayoutDashboard, exact: true },
  { href: '/dashboard/my-events',   label: 'My Events',    icon: CalendarDays },
  { href: '/dashboard/invitations', label: 'Invitations',  icon: Mail },
  { href: '/dashboard/reviews',     label: 'My Reviews',   icon: Star },
  { href: '/dashboard/settings',    label: 'Settings',     icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    toast.success('Signed out');
    router.push('/');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      {/* User profile */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white overflow-hidden ring-2 ring-[var(--primary)]/30">
              {user.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : user.name.charAt(0).toUpperCase()
              }
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success)] rounded-full border-2 border-[var(--surface)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[var(--text)] text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[var(--muted)] text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {sidebarLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}
              className={clsx(
                'group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden',
                active
                  ? 'text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 gradient-bg opacity-[0.06] rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <Icon className={clsx('w-4 h-4', active ? 'text-[var(--primary)]' : 'text-[var(--muted)] group-hover:text-[var(--text)]')} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 text-[var(--primary)] relative" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--border)]">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/8 transition-all duration-200">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 flex bg-[var(--bg)]">
        {/* Desktop sidebar */}
        <aside className="w-60 flex-shrink-0 hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] bg-[var(--surface)] border-r border-[var(--border)]">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                className="fixed left-0 top-16 bottom-0 w-60 z-50 flex flex-col bg-[var(--surface)] border-r border-[var(--border)] md:hidden"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile toggle bar */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
            <button onClick={() => setMobileOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-sm text-[var(--muted)] font-medium">
              {sidebarLinks.find(l => isActive(l.href, l.exact))?.label ?? 'Dashboard'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 lg:p-8 max-w-5xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
