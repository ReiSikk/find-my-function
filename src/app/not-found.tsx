'use client'
 
import Link from 'next/link'
 
export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4 text-(--color-primary)">404 Not Found...</h2>
      <p className="text-center mb-6">{}</p>
      <Link 
        href="/"
        className="btn-main bg-(--color-primary) text-(--color-bg)"
      >
        Return Home
      </Link>
    </div>
  )
}