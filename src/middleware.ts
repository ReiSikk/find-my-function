import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedAccountRoute = createRouteMatcher('/account/(.*)')
const isAdminRoute = createRouteMatcher('/api/scrape(.*)')

export default clerkMiddleware(async (auth, req) => {

  // Protect Account routes
  if (isProtectedAccountRoute(req)) {
    await auth.protect()
  }

  // Protect API routes
   if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const errorMessage = 'Not Found: you do not have permission to access this resource'
    const url = new URL('/error', req.url)
    url.searchParams.set('message', errorMessage)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}