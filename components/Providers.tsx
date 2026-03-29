'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
    
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="noise-overlay">{children}</div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
