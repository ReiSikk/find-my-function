"use client"

import { DrinksList } from "./components/drinks-list"
import { FilterSidebar } from "./components/filter-sidebar"
import { DrinksProvider } from "@/lib/context/DrinksContext"
import { HeroSection } from "./components/home-hero"
import CardsCarousel from "./components/cards-carousel"

export default function Home() {
  return (
    <DrinksProvider>
    <HeroSection />
    <main className="min-h-screen bg-background bg-(--color-bg) text-(--color-primary) px-[16px] md:px-[32px] lg:*[64px]">
         <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
        <aside className="md:col-span-1 w-full">
          <FilterSidebar />
        </aside>
        <div className="md:col-span-3 w-full">
          <DrinksList />
        </div>
      </div>
    <section className="carousel">
      <h4 className="text-(length:--fs-h4) md:pl-4 w-fit">Your favourites</h4>
      <CardsCarousel showOnlyFavorites={true}/>
    </section>
    </main>
    </DrinksProvider>
  )
}
