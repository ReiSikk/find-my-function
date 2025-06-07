"use client"

import { useUser } from "@clerk/nextjs"
import { AccountSidebar } from "../components/account-sidebar"
import  CardsCarousel  from "../components/cards-carousel"
import { DrinksProvider } from "@/lib/context/DrinksContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LucideArrowLeft } from "lucide-react"
import { NutritionStackView } from "../components/nutrition-stack-view"
import { redirect } from "next/navigation"
import { getBaseUrl } from '../../lib/utils/get-base-url'
import StravaActivities from "../components/strava-activities"
import { Spinner } from "@/components/ui/spinner"

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"

  // Handle custom shopping list creation
    const [selectedStack, setSelectedStack] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      const baseUrl = getBaseUrl() || '/'
      console.log(baseUrl);
      redirect(`https://immune-fowl-19.accounts.dev/sign-in?redirect_url=${baseUrl}`)
    }
  }, [isLoaded, user])

  // Show loading while Clerk loads user data
  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }

    if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-primary)">
      <DrinksProvider>
          <div className="flex min-h-screen w-full">
            <AccountSidebar user={user} isAdmin={isAdmin}/>
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto pt-6 px-6 pb-[100px]">
                  <div className="space-y-6">
                      <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-primary)] border border-transparent hover:border-[var(--color-primary)] hover:bg-secondary rounded-full px-4 py-2 mt-4" aria-label="Back to home page">
                      <LucideArrowLeft className="h-4 w-4" />
                      Back home
                      </Link>
                      <StravaActivities />
                      <h1 className="text-(length:--fs-h4) mb-2 font-bold">My List</h1>
                      <p className="text-muted-foreground">Your saved drinks and favorites</p>
                      <CardsCarousel showOnlyFavorites={true}/>
                      <NutritionStackView stack={selectedStack} onSelectStack={setSelectedStack}/>
                  </div>
                </div>
              </main>
          </div>
      </DrinksProvider>
    </div>
  )
}