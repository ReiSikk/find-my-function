import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useDrinksContext } from "@/lib/context/DrinksContext"
import { useFavorites } from "../../lib/hooks/useFavourites"
import { DrinkCard } from "./drink-card"
import { useMemo } from "react"

interface CardsCarouselProps {
  showOnlyFavorites?: boolean;
}

export default function CardsCarousel({ showOnlyFavorites = false }: CardsCarouselProps) {

    const {
        filteredDrinks,
        openOverlays,
        toggleCardOverlay,
    } = useDrinksContext(); 

      // Pass refreshDrinks as callback to useFavorites
    const { isFavorited, toggleFavorite } = useFavorites();
    
    
      // Memoize the display drinks to prevent unnecessary recalculations
      const displayDrinks = useMemo(() => {
        if (showOnlyFavorites) {
          return filteredDrinks.filter(drink => drink.id && isFavorited(drink.id));
        }
        return filteredDrinks;
      }, [filteredDrinks, showOnlyFavorites, isFavorited]);

  return (
    <Carousel
     opts={{
        align: "start",
        loop: false,
     }}
    >
        <CarouselContent className='md:ml-2 lg:-ml-4'>
        {displayDrinks.map((drink, index) => (
            <CarouselItem
             className="md:basis-1/2 lg:basis-1/3 l-2 md:pl-4 "
             key={index}>
                 <DrinkCard 
                     key={drink.id}
                     drink={drink}
                     isFavorited={isFavorited(drink.id!)}
                     onToggleFavorite={() => toggleFavorite(drink)} 
                     openOverlay={openOverlays[index]}
                     onToggleOverlay={() => toggleCardOverlay(index)}
                     index={index}
                     carouselMode={true}
                 />
             </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
  )
}