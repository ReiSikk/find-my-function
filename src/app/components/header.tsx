"use client"

import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useSidebar } from "@/components/ui/sidebar"
import { LucideClipboardList } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { state } = useSidebar();
  const sidebarOpen = state === "expanded";
  const [mounted, setMounted] = useState(false);

  const DotIcon = () => {
  return (
    <LucideClipboardList className="h-4 w-4 text-(--color-secondary)" />
  )
}

  // Prevent hydration mismatch by only rendering auth components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative border-b border-(--color-secondary) shadow-sm bg-(--color-bg) text-(--color-primary)">
      <div className="flex h-16 px-[16px] md:px-[32px] py-2 items-center justify-between w-full">
        <Link href="/" className="absolute left-[16px] md:left-1/2 top-1/2 translate-x-[16px] md:-translate-x-1/2 -translate-y-1/2 text-(length:--fs-h6) text-nowrap uppercase font-bold">
          Tempo
        </Link>
        <nav className={`flex items-center space-x-4 ${sidebarOpen ? 'justify-end' : 'justify-end'} w-full`}>
           {mounted && (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="cursor-pointer hover:underline underline-offset-2" type="button" aria-label="Sign in to your account">
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="cursor-pointer hover:underline underline-offset-2" type="button" aria-label="Sign up for an account">
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <div className="flex gap-4 items-end space-x-2">
                <SignedIn>
                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    <UserButton showName={true}>
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label="My Lists"
                          labelIcon={<DotIcon />}
                          href="/account"
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                  </div>
                </SignedIn>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
