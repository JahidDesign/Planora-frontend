'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, LogOut, Settings,
  LayoutDashboard, Shield, Sun, Moon, Bell, Plus
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/context/ThemeContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import Image from 'next/image';
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About Us' },
  { href: '/blogs', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/invitations/my').then(r => setPendingCount(r.data.invitations?.length || 0)).catch(() => { });
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { }
    logout();
    toast.success('Signed out');
    router.push('/');
  };

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      className={clsx(
        'transition-all duration-500',
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* <div className="relative">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center glow-primary group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl gradient-bg opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">Planora</span> */}
            <Image src="/Planora.png" alt="Planora" width={180} height={40} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive(href)
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                )}
              >
                {isActive(href) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link href="/dashboard/invitations" className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-200">
                  <Bell className="w-4 h-4" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--primary)] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                {/* Create event quick action */}
                <Link href="/dashboard/my-events?create=true">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-all duration-200">
                    <Plus className="w-3.5 h-3.5" />
                    Create
                  </button>
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface-2)] transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-[var(--primary)]/30">
                      {user.avatar
                        ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        : user.name.charAt(0).toUpperCase()
                      }
                    </div>
                    <span className="text-sm font-medium text-[var(--text)] max-w-[96px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={clsx('w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-200', userMenuOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-[var(--border)]">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{user.name}</p>
                          <p className="text-xs text-[var(--muted)] truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-1.5 px-1.5 space-y-0.5">
                          {[
                            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            ...(user.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin Panel', icon: Shield }] : []),
                            { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                          ].map(({ href, label, icon: Icon }) => (
                            <Link key={href} href={href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors">
                              <Icon className="w-4 h-4" /> {label}
                            </Link>
                          ))}
                        </div>
                        <div className="px-1.5 pb-1.5 border-t border-[var(--border)] pt-1.5">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] rounded-xl hover:bg-[var(--surface-2)] transition-all duration-200">
                  Login
                </Link>
                <Link href="/auth/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg glow-primary hover:opacity-90 transition-all duration-200">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface-2)] transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface-2)] transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[var(--border)]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}
                  className={clsx('block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(href) ? 'text-[var(--primary)] bg-[var(--primary)]/10' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  )}>
                  {label}
                </Link>
              ))}
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-xl">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/auth/login" className="block text-center px-4 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]/50">Login</Link>
                  <Link href="/auth/register" className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-white gradient-bg">Get Started Free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
