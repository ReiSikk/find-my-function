"use client"

import { useUser } from "@clerk/nextjs"
import { AccountSidebar } from "../components/account-sidebar"
import  CardsCarousel  from "../components/cards-carousel"
import { DrinksProvider } from "@/lib/context/DrinksProvider"
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
  const [mounted, setMounted] = useState(false);

  // Handle custom shopping list creation
    const [selectedStack, setSelectedStack] = useState("");

    useEffect(() => {
      setMounted(true)
    }, [])


  useEffect(() => {
    if (isLoaded && !user) {
      const baseUrl = getBaseUrl() || '/'
      console.log(baseUrl);
      redirect(`https://immune-fowl-19.accounts.dev/sign-in?redirect_url=${baseUrl}`)
    }
  }, [isLoaded, user])

  // Show loading state while Clerk is loading OR user is not available
  if (!isLoaded || !user || !mounted) {
    return (
      <DrinksProvider>
        <div className="min-h-screen bg-(--color-bg) text-(--color-primary)">
          <div className="flex min-h-screen w-full items-center justify-center">
            <Spinner />
          </div>
        </div>
      </DrinksProvider>
    );
  }

  return (
    <DrinksProvider>
    <div className="min-h-screen bg-(--color-bg) text-(--color-primary)">
          <div className="flex min-h-screen w-full">
            <AccountSidebar user={user} isAdmin={isAdmin}/>
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto pt-6 px-6 pb-[100px]">
                  <div className="space-y-6">
                      <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-primary)] border border-transparent hover:border-[var(--color-primary)] hover:bg-secondary rounded-full px-4 py-2 mt-4" aria-label="Back to home page">
                      <LucideArrowLeft className="h-4 w-4" />
                      Back home
                      </Link>
                      <div className="accountDashboard__header flex justify-between items-center flex-wrap mb-4">
                        <h1 className="h1 h1-grotesk mb-2 sm:w-full md:w-1/2">Hi, {user.firstName}</h1>
                        <p className="txt-medium sm:w-full md:w-1/2">Welcome to your dashboard!
                        Here you can manage your account, view your Strava activities, and explore and order your saved functional products.
                        </p>
                      </div>
                      <StravaActivities />
                      <h1 className="text-(length:--fs-h4) mb-2 font-bold">My List</h1>
                      <p className="text-muted-foreground">Your saved drinks and favorites</p>
                      <CardsCarousel showOnlyFavorites={true}/>
                      <NutritionStackView stack={selectedStack} onSelectStack={setSelectedStack}/>
                  </div>
                </div>
              </main>
          </div>
    </div>
   </DrinksProvider>
  )
}