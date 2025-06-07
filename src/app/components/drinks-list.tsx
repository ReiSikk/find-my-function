"use client"

import { useDrinksContext } from "../../lib/context/DrinksContext"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useFavorites } from "../../lib/hooks/useFavourites"
import { DrinkCard } from "./drink-card"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface DrinksListProps {
  showOnlyFavorites?: boolean;
}

export function DrinksList({ showOnlyFavorites = false}: DrinksListProps) {
   const {
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    totalCount,
    loadedCount,
    error,
    openOverlays,
    toggleCardOverlay,
  } = useDrinksContext();  

  const { data: favoritedDrinks = new Set(), isLoading } = useFavorites();
  

  // Memoize the display drinks to prevent unnecessary recalculations
   const displayDrinks = useMemo(() => {
    if (showOnlyFavorites) {
      return filteredDrinks.filter(drink => 
        drink.id && favoritedDrinks.has(drink.id)
      );
    }
    return filteredDrinks;
  }, [filteredDrinks, showOnlyFavorites, favoritedDrinks]);

  if (showOnlyFavorites && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg"/>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 mb-[100px]">
      <div className="flex flex-col gap-2 sm:flex-row justify-between">
          {displayDrinks && (
          <h2 className="text-(length:--fs-h6) font-bold">
             <div>
              {showOnlyFavorites
                ? `Found ${displayDrinks.length} favorite drinks`
                : `Found ${totalCount} drinks`
              }
            </div>
            {!showOnlyFavorites && totalCount > 0 && (
              <div className="txt-small opacity-80 text-muted-foreground/80">
                Displaying {displayDrinks.length} of {totalCount} total drinks
              </div>
            )}
          </h2>
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
          <Spinner size="lg"/>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayDrinks.map((drink, index) => (
          <DrinkCard 
              key={drink.id}
              drink={drink}
              openOverlay={openOverlays[index]}
              onToggleOverlay={() => toggleCardOverlay(index)}
              index={index}
          />
        ))}
      </div>
      )}
      {hasMore && !showOnlyFavorites && (
          <div className="flex flex-col items-center gap-2 pt-6">
            <div className="txt-small text-muted-foreground/70">
              {`You have viewed ${loadedCount} of ${totalCount} drinks`}
            </div>
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              variant="outline"
              size="lg"
              className="min-w-[120px] cursor-pointer hover:bg-(--color-primary) hover:text-(--color-bg)"
            >
              {loadingMore ? (
                <>
                  <Spinner size="sm"/>
                  Loading more...
                </>
              ) : (
                `Load More (${totalCount - loadedCount} remaining)`
              )}
            </Button>
          </div>
        )}
    </div>
  )
}
