import { DrinksList } from "./components/drinks-list"
import { Header } from "./components/header"
import { FilterSidebar } from "./components/filter-sidebar"
import { DrinksProvider } from "@/lib/context/DrinksContext"

export default function Home() {
  return (
    <DrinksProvider>
    <main className="min-h-screen bg-background bg-(--color-bg) text-(--color-white) px-[16px] md:px-[32px] lg:*[64px]">
      <Header />
         <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
        <aside className="md:col-span-1 w-full">
          <FilterSidebar />
        </aside>
        <div className="md:col-span-3 w-full">
          <DrinksList />
        </div>
      </div>
    </main>
    </DrinksProvider>
  )
}
