'use client'

import { useState } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '../../app/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { FavoritesProvider } from './FavouritesProvider'

// Create a client component that handles all the providers
export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize the QueryClient inside the client component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <FavoritesProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </FavoritesProvider>
      </ClerkProvider>
    </QueryClientProvider>
  )
}