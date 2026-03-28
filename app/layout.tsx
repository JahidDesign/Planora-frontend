import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Planora — Event Management Platform',
    template: '%s | Planora',
  },
  description:
    'Create, discover, and join amazing events. Planora connects people through unforgettable experiences.',
  keywords: ['events', 'event management', 'conferences', 'meetups', 'workshops'],
  themeColor: '#0B0F19',


  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('planora-theme');
                var preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                var theme = stored || preferred;
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-[var(--bg)] text-[var(--text)] antialiased">
        <Providers>
          {children}

          {/* Toast UI */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'var(--surface)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--error)',
                  secondary: 'var(--surface)',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}