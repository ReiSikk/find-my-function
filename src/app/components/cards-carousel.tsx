import React, { useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useDrinksContext } from "@/lib/context/DrinksProvider"
import { useFavorites } from "../../lib/hooks/useFavourites"
import { DrinkCard } from "./drink-card"
import { useMemo } from "react"
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { LucideArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getBaseUrl } from '../../lib/utils/get-base-url'
import { Spinner } from '@/components/ui/spinner'

interface CardsCarouselProps {
  showOnlyFavorites?: boolean;
}

export default function CardsCarousel({ showOnlyFavorites = false }: CardsCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const {
        filteredDrinks,
        openOverlays,
        toggleCardOverlay,
    } = useDrinksContext(); 

      // Get favourites from hook
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


// Define wheel gesture options for carousel
  const wheelGesturesOptions = {
    forceWheelAxis: 'x',
    wheelDraggingClass: 'is-wheeling',
    target: carouselRef.current
  }


    if (showOnlyFavorites && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (showOnlyFavorites && favoritedDrinks.size <= 0) {
    return (
       <div className="w-full flex flex-col gap-4 items-center justify-center bg-(--color-primary) p-16 rounded-sm md:max-w-[50vw] m-auto">
          <p className="text-(--color-bg) text-center">
            You have no favorites yet. Start browsing and add drinks to your list.
          </p>
        <Link href={getBaseUrl() || '/'}>
          <button className="btn-main hover:border-(--color-bg)" type="button" aria-label="Sign in to your account">
            <span>Continue</span>
            <LucideArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    )
  }

  return (
    <Carousel
     opts={{
        align: "start",
        loop: false,
        slidesToScroll: 'auto'
     }}
      plugins={[WheelGesturesPlugin(wheelGesturesOptions)]}
      className='carousel'
      ref={carouselRef}
    >
        <CarouselContent className=''>
        {displayDrinks.map((drink, index) => (
            <CarouselItem
             className="md:basis-1/2 lg:basis-1/3 l-2 "
             key={index}>
                 <DrinkCard 
                     key={drink.id}
                     drink={drink}
                     openOverlay={openOverlays[index]}
                     onToggleOverlay={() => toggleCardOverlay(index)}
                     index={index}
                 />
             </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
  )
}