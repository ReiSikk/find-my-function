"use client"

import Link from "next/link"
import { ModeToggle } from "../components/mode-toggle"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export function Header() {

  return (
    <header className="border-b px-4 py-2 shadow-sm">
      <div className="flex h-16 items-center justify-between w-full">
        <Link href="/" className="text-[var(--fs-h1)] font-semibold">
          Find your tempo
        </Link>
        <nav className="flex items-center space-x-4">
          <ModeToggle />
           <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <div className="flex flex-col gap-1.5 items-center space-x-2">
              <SignedIn>
                <Link href="/account" className="text-(length:--fs-small) font-semibold">
                  My List
                </Link>
                <UserButton />
                <p className="text-(length:--fs-small)">Profile settings</p>
              </SignedIn>
            </div>
        </nav>
      </div>
    </header>
  )
}
