import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Drink } from "@/lib/types"
import { useDrinksContext } from "@/lib/context/DrinksContext"

interface CardsCarouselProps {
  drinks: Drink[];
}

export default function CardsCarousel() {
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
      console.log("Filtered drinks in CardsCarousel:", filteredDrinks);

  return (
    <Carousel
     opts={{
        align: "start",
        loop: true,
     }}
    >
        <CarouselContent>
        {filteredDrinks.map((drink) => (
            <CarouselItem key={drink.id} className="md:basis-1/2 lg:basis-1/3">
            </CarouselItem>
         ))}
        </CarouselContent>
    </Carousel>
  )
}