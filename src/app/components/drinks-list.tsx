"use client"

import { useDrinksContext } from "../../lib/context/DrinksContext"
import Image from "next/image"
import { ExternalLink, LucidePlus } from "lucide-react"
import { Drink } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase-client";

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"


export async function fetchDrinks(): Promise<Drink[]> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('drinks')
    .select('*')
    .order('price', { ascending: true });
    
  if (error) {
    console.error("Error fetching drinks:", error);
    throw new Error("Failed to load drinks data");
  }
  
  return data || [];
}


export function DrinksList() {
   const {
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    activeCardId,
    toggleCardOverlay,
    refreshDrinks,
  } = useDrinksContext();  

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row justify-between">
        <h1 className="text-2xl font-bold">Functional Drinks</h1>
        <div className="w-full sm:max-w-[250px]">
            <Input className="rounded-full" placeholder="Search drinks..." value={searchTerm} onChange={(e) => {
              setSearchTerm(e.target.value);
              }} />
        </div>
      </div>


        {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-secondary)]"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )  : filteredDrinks.length === 0 ? (
        // Show a message when no drinks match the filters
        <div className="text-center p-12 bg-(--color-bg--light) rounded-md">
          <h3 className="mb-2 text-(--color-white)">No drinks found</h3>
          <p className="text-(length:--fs-p) text-(--color-white) opacity-90">
            No drinks match your current filters. Try adjusting the price range or search term.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink, index) => (
          <Card key={drink.name} className="overflow-hidden relative">
            <div className="aspect-square relative bg-muted">
                <Badge variant="outline" className="absolute top-2 right-2 z-8 bg-(--color-secondary) text-(--color-primary) text-(length:--fs-p) rounded-full border-none px-[16px] py-[6px]" aria-label="Badge displaying product price">{drink.price.toFixed(2)}€</Badge>
              <Image src={ drink.image || "/placeholder.svg"} alt={`Product image displaying the product ${drink.name}`} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-medium text-(length:--fs-h6)">{drink.name}</h3>
                  <a className="bg-(--color-secondary) text-(--color-primary) flex items-center justify-center cursor-pointer rounded-full p-2" href={drink.url} target="_blank" rel="noopener noreferrer" aria-label="External link to buy the product">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

               {drink.tags && drink.tags.length > 0 && (
                  <div className="mt-3 mb-6 flex flex-wrap gap-1">
                    {drink.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-(length:--fs-small) rounded-full px-4 py-1.5 text-(--color-bg--light) bg-(--color-secondary)">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

            </CardContent>
            <CardFooter className="pt-0 flex gap-2 justify-end relative">
                   <div 
                   className={`flex justify-between items-center pl-[22px] pr-[8px] gap-4 rounded-full py-2 border border-transparent bg-(--color-bg) cursor-pointer z-10 transition-all duration-200 ${activeCardId === index ? 'hover:border-(--color-primary) hover:bg-(--color-secondary) hover:text-(--color-primary)' : 'hover:bg-(--color-secondary) hover:text-(--color-primary)'}`}
                   onClick={() => toggleCardOverlay(index)}
                   aria-label={`${activeCardId === index ? 'Close overlay' : 'Open card overlay to view product ingredients'}`}
                   role="button"
                   >
                      <span className="whitespace-nowrap text-(length:--fs-p)">
                        {activeCardId === index ? 'Close overlay' : 'View ingredients'}
                      </span>
                    <div className="bg-(--color-white) rounded-full p-2">
                        <LucidePlus 
                        className={`h-4 w-4 text-[var(--color-bg)] transition-transform duration-200 ${
                          activeCardId === index ? 'rotate-45' : ''
                        }`}
                        />
                    </div>
                  </div>
            </CardFooter>
            {activeCardId === index && (
              <div className="absolute inset-0 bg-(--color-secondary) text-(--color-bg) flex flex-col px-6 pb-16 pt-4 z-9">
                <h4>Ingredients</h4>
                <ul className="list-disc pl-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {drink.ingredients.map((ingredient) => (
                    <li key={ingredient} className="text-(length:--fs-p)">{ingredient}</li>
                  ))}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-secondary)] to-transparent backdrop-blur-[1px] pointer-events-none"></div>
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
