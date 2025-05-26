"use client"

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { AccountSidebar } from "../components/account-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DrinksList } from "../components/drinks-list"
import { DrinksProvider } from "@/lib/context/DrinksContext"
import { UserData } from "@/lib/types"

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  console.log("User:", user);

  // Show loading while Clerk loads user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/sign-in")
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
    <div className="min-h-screen bg-background">
      <DrinksProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AccountSidebar user={userData} />
            <SidebarInset className="flex-1">
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight">My List</h1>
                      <p className="text-muted-foreground">Your saved drinks and favorites</p>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-6">
                      <DrinksList showOnlyFavorites={true} />
                    </div>
                  </div>
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </DrinksProvider>
    </div>
  )
}