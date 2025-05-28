"use client"

import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile
} from '@clerk/nextjs'
import { useSidebar } from "@/components/ui/sidebar"
import { LucideClipboardList } from "lucide-react"

export function Header() {
  const { state } = useSidebar();
  const sidebarOpen = state === "expanded";

  const DotIcon = () => {
  return (
    <LucideClipboardList className="h-4 w-4 text-(--color-secondary)" />
  )
}

  return (
    <header className="border-b border-(--color-secondary) px-[16px] md:px-[32px] py-2 shadow-sm bg-(--color-bg) text-(--color-primary)">
      <div className="flex h-16 items-center justify-between w-full">
        <Link href="/" className="text-(length:--fs-h6) text-nowrap uppercase font-bold">
          Tempo
        </Link>
        <nav className={`flex items-center space-x-4 ${sidebarOpen ? 'justify-end' : 'justify-end'} w-full`}>
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
        </nav>
      </div>
    </header>
  )
}
