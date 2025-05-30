"use client"

import { useDrinksContext } from "../../lib/context/DrinksContext"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Heart, LucidePlus } from "lucide-react"
import { Drink } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase-client";

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FavoriteButton } from "./favorite-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useFavorites } from "../../lib/hooks/useFavourites"


interface DrinksListProps {
  showOnlyFavorites?: boolean;
}

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



export function DrinksList({ showOnlyFavorites = false}: DrinksListProps) {
   const {
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    openOverlays,
    toggleCardOverlay,
    refreshDrinks,
  } = useDrinksContext();  
  

  // Pass refreshDrinks as callback to useFavorites
const { favoritedDrinks, isFavorited, toggleFavorite } = useFavorites({
  onFavoriteChange: () => {
    console.log("Favorite changed! Calling refreshDrinks...");
    refreshDrinks();
  }
});

  // Filter drinks based on favorites if prop is true
  const displayDrinks = showOnlyFavorites 
    ? filteredDrinks.filter(drink => drink.id && isFavorited(drink.id))
    : filteredDrinks;

  return (
    <div className="space-y-6 mb-[100px]">
      <div className="flex flex-col gap-2 sm:flex-row justify-between">
          {displayDrinks && (
          <h1 className="text-2xl font-bold">
            {showOnlyFavorites 
              ? `Found ${displayDrinks.length} favorite drinks` 
              : `Found ${displayDrinks.length} matching drinks`
            }
          </h1>
        )}
        <div className="w-full sm:max-w-[250px]">
          <Input 
            className="rounded-full" 
            placeholder={showOnlyFavorites ? "Search favorites..." : "Search drinks..."} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>


        {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )  : displayDrinks.length === 0 ? (
        <div className="text-center p-12 bg-[var(--color-primary)] text-(--color-bg) rounded-md">
          <h3 className="mb-2">
            {showOnlyFavorites ? "No favorite drinks found" : "No drinks found"}
          </h3>
          <p className="text-[var(--fs-p)]] opacity-90">
            {showOnlyFavorites 
              ? "You haven't favorited any drinks yet. Start exploring and add some favorites!"
              : "No drinks match your current filters. Try adjusting the price range or search term."
            }
          </p>
            <Link
              href="/" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all cursor-pointer bg-[var(--color-bg)] text-[var(--color-primary)] border border-transparent hover:border-[var(--color-bg)] hover:bg-transparent hover:text-(--color-bg) rounded-full px-4 py-2 mt-4"
            >
               Browse all drinks
          </Link>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayDrinks.map((drink, index) => (
          <Card 
            key={drink.name} 
            className="overflow-hidden relative"
            hasActiveOverlay={openOverlays[index]}
          >
            <div className="aspect-square relative bg-muted">
                <Badge variant="outline" className="absolute top-2 right-2 z-8 bg-(--color-primary) text-(--color-bg) txt-small rounded-full border-none px-[12px] py-[6px]" aria-label="Badge displaying product price">{drink.price.toFixed(2)}€</Badge>
              <Image src={ drink.image || "/placeholder.svg"} alt={`Product image displaying the product ${drink.name}`} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-medium text-(length:--fs-h6)">{drink.name}</h3>
                  <a className="bg-(--color-primary) text-(--color-bg) flex items-center justify-center cursor-pointer rounded-full p-2" href={drink.url} target="_blank" rel="noopener noreferrer" aria-label="External link to buy the product">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

               {drink.tags && drink.tags.length > 0 && (
                  <div className="mt-3 mb-6 flex flex-wrap gap-1">
                    {drink.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="txt-small rounded-full px-4 py-1.5 text-(--color-bg) bg-(--color-primary)">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

            </CardContent>
            <CardFooter className="pt-0 px-4 justify-between flex gap-2 relative">
              
                <FavoriteButton 
                  drink={drink} 
                  isFavorited={isFavorited(drink.id!)}
                  onToggleFavorite={toggleFavorite}
                />
               <div 
                  className={`group flex flex-1 justify-between max-w-[225px] items-center pl-[22px] pr-[8px] gap-4 rounded-full py-2 border border-transparent bg-[var(--color-primary)] text-[var(--color-bg)] cursor-pointer z-10 transition-all duration-200 ${
                    openOverlays[index] 
                      ? ' bg-[var(--color-bg)] hover:text-[var(--color-bg)] hover:border-[var(--color-bg)]' 
                      : 'hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]'
                  }`}
                  onClick={() => toggleCardOverlay(index)}
                  aria-label={`${openOverlays[index] ? 'Close overlay' : 'Open card overlay to view product ingredients'}`}
                  role="button"
                >
                  <span className="whitespace-nowrap text-[var(--fs-small)]">
                    {openOverlays[index] ? 'Close overlay' : 'View ingredients'}
                  </span>
                  <div className="bg-[var(--color-bg)] rounded-full p-2 transition-all duration-200 group-hover:bg-[var(--color-primary)]">
                    <LucidePlus 
                      className={`h-4 w-4 text-[var(--color-primary)] transition-all duration-200 group-hover:text-[var(--color-bg)] ${
                        openOverlays[index] ? 'rotate-45' : ''
                      }`}
                    />
                  </div>
                </div>
            </CardFooter>
              <div className={`absolute inset-0 bg-[var(--color-primary)] text-[var(--color-bg)] flex flex-col px-6 pb-16 pt-4 z-9 transition-opacity duration-300 ${
                openOverlays[index] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}>
                <h4 className="text-(length:--fs-h5) pb-1.5 border-b">Ingredients</h4>
                   {drink.tags && drink.tags.length > 0 && (
                    <>
                    <span className="txt-p mt-3">This product contains the following functional ingredients:</span>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {drink.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="txt-small rounded-full px-3 py-1.5 text-(--color-primary) bg-(--color-bg)">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    </>
                )}

                <ul className="list-none pl-6 mt-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {drink.ingredients.map((ingredient) => (
                    <li key={ingredient} className="txt-small">{ingredient}</li>
                  ))}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-primary)] to-transparent backdrop-blur-[1px] pointer-events-none"></div>
                </ul>
              </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
