"use client"

import { useUser } from "@clerk/nextjs"
import { AccountSidebar } from "../components/account-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DrinksList } from "../components/drinks-list"
import { DrinksProvider } from "@/lib/context/DrinksContext"
import { UserData } from "@/lib/types"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LucideArrowLeft } from "lucide-react"
import { NutritionStackView } from "../components/nutrition-stack-view"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Handle custom shopping list creation
    const [selectedStack, setSelectedStack] = useState<string | null>(null);

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


  // Handle back to favorites click
  const handleBackToFavorites = () => {
    setSelectedStack(null);
    router.push("/account");
  }

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-primary)">
      <DrinksProvider>
          <div className="flex min-h-screen w-full">
            <AccountSidebar user={userData} onSelectStack={setSelectedStack} />
            <SidebarInset className="flex-1">
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto pt-6 px-6 pb-[100px]">
                  <div className="space-y-6">
                    {!selectedStack ? (
                      <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-primary)] border border-transparent hover:border-[var(--color-primary)] hover:bg-secondary rounded-full px-4 py-2 mt-4" aria-label="Back to home page">
                      <LucideArrowLeft className="h-4 w-4" />
                      Back home
                      </Link>
                    ) : (
                       <button 
                       type="button"
                       className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-primary)] border border-transparent hover:border-[var(--color-primary)] hover:bg-secondary rounded-full px-4 py-2 mt-4"
                       onClick={handleBackToFavorites}
                       aria-label="Back to favourites"
                       >
                      <LucideArrowLeft className="h-4 w-4" />
                      Back to favourites
                      </button>
                    )}

                    {/* Render different views based on selectedStack */}
                    {!selectedStack && (
                      <>
                        <h1 className="text-3xl font-bold tracking-tight">My List</h1>
                        <p className="text-muted-foreground">Your saved drinks and favorites</p>
                        <DrinksList showOnlyFavorites={true} />
                      </>
                    )}
                    {selectedStack && (
                      <NutritionStackView stack={selectedStack} onSelectStack={setSelectedStack}/>
                    )}

                  </div>
                </div>
              </main>
            </SidebarInset>
          </div>
      </DrinksProvider>
    </div>
  )
}