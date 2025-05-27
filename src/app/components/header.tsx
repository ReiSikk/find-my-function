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
import { useSidebar } from "@/components/ui/sidebar"

export function Header() {
  const { state } = useSidebar();
  const sidebarOpen = state === "expanded";

  return (
    <header className="border-b border-(--color-secondary) px-4 py-2 shadow-sm bg-(--color-bg) text-(--color-secondary)">
      <div className="flex h-16 items-center justify-between w-full">
        {!sidebarOpen &&
        <Link href="/" className="text-[var(--fs-h1)] ml-16">
          Find your tempo
        </Link>
        }
        <nav className={`flex items-center space-x-4 text-(--color-secondary) ${sidebarOpen ? 'justify-end' : 'justify-end'} w-full`}>
          {/* <ModeToggle /> */}
           <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <div className="flex gap-4 items-end space-x-2">
              <SignedIn>
                <Link href="/account" className="text-(length:--fs-nav) font-semibold uppercase tracking-wide mr-0">
                  My List
                </Link>
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <UserButton />
                  <p className="text-(length:--fs-nav) font-semibold uppercase tracking-wide ">Profile settings</p>
                </div>
              </SignedIn>
            </div>
        </nav>
      </div>
    </header>
  )
}
