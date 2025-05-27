"use client"

import { useUser } from "@clerk/nextjs"
import { AccountSidebar } from "../components/account-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DrinksList } from "../components/drinks-list"
import { DrinksProvider } from "@/lib/context/DrinksContext"
import { UserData } from "@/lib/types"
import { useEffect } from "react"
import Link from "next/link"
import { LucideArrowLeft } from "lucide-react"

export default function AccountPage() {
  const { user, isLoaded } = useUser()

    useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = "https://immune-fowl-19.accounts.dev/sign-in?redirect_url=http://localhost:3000/";
    }
  }, [isLoaded, user]);

  // Show loading while Clerk loads user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

    if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

    const userData: UserData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    emailAddress: user.emailAddresses[0]?.emailAddress, // This can be undefined
    createdAt: user.createdAt, // This is Date | null from Clerk
  }

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-secondary)">
      <DrinksProvider>
          <div className="flex min-h-screen w-full">
            <AccountSidebar user={userData} />
            <SidebarInset className="flex-1">
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto pt-6 px-6 pb-[100px]">
                  <div className="space-y-6">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-secondary)] border border-transparent hover:border-[var(--color-secondary)] hover:bg-secondary hover:text-(--color-bg) rounded-full px-4 py-2 mt-4">
                    <LucideArrowLeft className="h-4 w-4" />
                    Back home
                    </Link>
                    <div className="space-y-2 max-w-[1280px] mx-auto">
                      <h1 className="text-3xl font-bold tracking-tight">My List</h1>
                      <p className="text-muted-foreground">Your saved drinks and favorites</p>
                    </div>

                    <DrinksList showOnlyFavorites={true} />

                  </div>
                </div>
              </main>
            </SidebarInset>
          </div>
      </DrinksProvider>
    </div>
  )
}