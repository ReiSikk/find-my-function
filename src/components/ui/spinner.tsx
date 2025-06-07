"use client"
import { useEffect, useState } from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div 
      className={`${mounted ? 'animate-spin' : ''} rounded-full border-2 border-transparent border-t-current ${sizeClasses[size]} ${className}`}
    />
  )
}