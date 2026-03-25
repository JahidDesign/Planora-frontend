'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ─── Count Up ─────────────────────────────────────────────────────────────────
export function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const startVal = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + eased * (target - startVal)));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ─── Intersection (one-shot, returns ref + boolean) ────────────────────────
export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Real-time live count (simulates WebSocket updates) ─────────────────────
export function useLiveCount(initial: number, eventId?: string) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    if (!eventId) return;
    // Simulate real-time updates (replace with actual WebSocket/SSE)
    const interval = setInterval(() => {
      // Small chance of increment to simulate live joins
      if (Math.random() > 0.92) {
        setCount((c) => c + 1);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [eventId]);

  return count;
}
