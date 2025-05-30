'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../../app/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

// Create a client component that handles all the providers
export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize the QueryClient inside the client component
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  )
}