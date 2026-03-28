import Link from 'next/link';
import { Zap, Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
const footerLinks = {
  Product: [
    { label: 'Events', href: '/events' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socials = [
  { icon: Twitter, href: 'https://x.com/JahidHasanMERN', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/JahidDesign', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/jahidhasan-webdeveloper/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:jahidhasan.en@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 bg-[var(--surface)] border-t border-[var(--border)]">
      {/* Animated top border */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

      {/* Newsletter strip */}
      {/* <div className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--text)]">Stay in the loop</h3>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit mb-4">
              {/* <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">Planora</span> */}
              <Image src="/planora.png" alt="Planora" width={180} height={40} />
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-xs">
              The modern event platform for creators who care about experience. Create, discover, and join events that matter.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/8 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-[var(--text)] text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-[var(--muted)] text-sm hover:text-[var(--primary)] transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--muted-2)] text-sm">
            © {new Date().getFullYear()} Planora, Inc. All rights reserved.
          </p>
          <p className="text-[var(--muted-2)] text-sm flex items-center gap-1.5">
            Built with <span className="text-[var(--error)]">♥</span> using Next.js, Node.js & Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
