import { DrinksList } from "./components/drinks-list"
import { Header } from "./components/header"
import { FilterSidebar } from "./components/filter-sidebar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background bg-white text-gray-700 px-[16px] md:px-[32px] lg:*[64px]">
      <Header />
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
        <aside className="md:col-span-1">
          <FilterSidebar />
        </aside>
        <div className="md:col-span-3">
          <DrinksList />
        </div>
      </div>
    </main>
  )
}
