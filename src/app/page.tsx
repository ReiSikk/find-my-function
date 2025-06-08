"use client"

import { DrinksList } from "./components/drinks-list"
import { FilterSidebar } from "./components/filter-sidebar"
import { DrinksProvider } from "@/lib/context/DrinksProvider"
import { HeroSection } from "./components/home-hero"
import CardsCarousel from "./components/cards-carousel"
import { useFavorites } from "@/lib/hooks/useFavourites"
import { LucideArrowRight } from 'lucide-react'
import {
  SignInButton,
  useSession,
} from '@clerk/nextjs'

export default function Home() {
  const { data: favoritedDrinks = new Set() } = useFavorites();
  const { session } = useSession();

  return (
    <DrinksProvider>
    <HeroSection />
    <main className="min-h-screen bg-background bg-(--color-bg) text-(--color-primary) px-[16px] md:px-[32px] lg:*[64px]">
         <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
        <aside className="md:col-span-1 w-full">
          <FilterSidebar />
        </aside>
        <div className="md:col-span-3 w-full">
          <DrinksList />
        </div>
      </div>
      <section className="carousel mb-8 md:my-16">
        <h4 className="text-(length:--fs-h4) md:pl-4 w-fit">Your favourites</h4>
        { favoritedDrinks && favoritedDrinks.size > 0 ?
          <CardsCarousel showOnlyFavorites={true}/>
          : (
            <div className="w-full flex flex-col gap-4 items-center justify-center bg-(--color-primary) p-16 rounded-sm md:max-w-[50vw] m-auto">
              {!session ? (
                <p className="text-(--color-bg) text-center">
                  You have no favorites yet. Log in or Sign up to start adding favourites.
                </p>
              ) : (
                 <p className="text-(--color-bg) text-center">
                  You have no favorites yet. Start browsing and add drinks to your list.
                </p>
              )
              }
              <SignInButton mode="redirect">
                <button className="btn-main hover:border-(--color-bg)" type="button" aria-label="Sign in to your account">
                  <span>Continue</span>
                  <LucideArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </div>
          )
          }
      </section>
    </main>
    </DrinksProvider>
  )
}
