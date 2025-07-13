import Image from "next/image";
import { ExternalLink, LucidePlus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "./favorite-button";
import { Badge } from "@/components/ui/badge";
import { Drink } from "../../lib/types";

interface DrinkCardProps {
  drink: Drink;
  openOverlay?: boolean;
  onToggleOverlay?: () => void;
  index: number;
}

export function DrinkCard({
  drink,
  openOverlay,
  onToggleOverlay,
  index
}: DrinkCardProps) {

  return (
    <Card 
      key={drink.name} 
      className={`overflow-hidden relative h-full shadow-md rounded-md`}
      hasActiveOverlay={openOverlay}

    >
      <div className="aspect-square relative bg-muted">
        <Badge variant="outline" className="absolute top-2 right-2 z-8 bg-(--color-primary) text-(--color-bg) txt-small rounded-full border-none px-[12px] py-[6px]" aria-label="Badge displaying product price">
          {drink.price.toFixed(2)}€
        </Badge>
        <Image 
        src={drink.image || "/placeholder.svg"} 
        alt={`Product image displaying the product ${drink.name}`} 
        fill 
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
        className="w-full height-auto object-contain drinkCard__img" 
        priority={index === 0}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start justify-between gap-6">
            <h3 className="font-medium text-(length:--fs-h6) text-(--color-primary)">{drink.name}</h3>
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
      <CardFooter className="pt-0 px-4 justify-between flex flex-wrap md:flex-nowrap gap-2 relative">
        <FavoriteButton 
          drink={drink} 
          className="drop-shadow-md"
        />
        <div 
          className={`group flex flex-1 justify-between max-w-[225px] items-center pl-[22px] pr-[8px] gap-4 rounded-full py-2 border cursor-pointer z-10 transition-all duration-200 ${
            openOverlay 
              ? ' bg-(--color-bg) text-(--color-primary)' 
              : 'border-(--color-primary) bg-(--color-primary) text-(--color-bg)  hover:bg-(--color-bg) hover:text-(--color-primary) hover:border-(--color-primary)'
          }`}
          onClick={onToggleOverlay}
          aria-label={`${openOverlay ? 'Close overlay' : 'Open card overlay to view product ingredients'}`}
          role="button"
        >
          <span className="whitespace-nowrap text-(length:--fs-small)">
            {openOverlay ? 'Close overlay' : 'Ingredients'}
          </span>
          <div className={`bg-(--color-bg) rounded-full p-2 transition-all duration-200 group-hover:bg-(--color-primary) ${openOverlay ? 'bg-(--color-primary)' : ''}`}>
            <LucidePlus 
              className={`h-4 w-4 transition-all duration-200 group-hover:text-(--color-bg) ${
                openOverlay ? 'text-(--color-bg) rotate-45' : 'text-(--color-primary)'
              }`}
            />
          </div>
        </div>
      </CardFooter>
      <div className={`absolute inset-0 bg-[var(--color-primary)] text-[var(--color-bg)] flex flex-col px-6 pb-16 pt-4 z-9 transition-opacity duration-300 ${
        openOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
        <ul className="list-none mt-8 pb-6 overflow-y-auto [scrollbar-width:thin] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {drink.ingredients.map((ingredient) => (
            <li key={ingredient} className="txt-small">{ingredient}</li>
          ))}
        </ul>
          <div className="absolute bottom-0 left-0 right-0 h-18 bg-gradient-to-t from-[var(--color-primary)] to-transparent backdrop-blur-[1px] pointer-events-none"></div>
      </div>
    </Card>
  );
}