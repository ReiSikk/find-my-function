import { Heart } from 'lucide-react';
import { Drink } from '../../lib/types';
import { useUser } from '@clerk/nextjs';
import { useFavorites, useToggleFavorite } from '@/lib/hooks/useFavourites';

interface FavoriteButtonProps {
  drink: Drink;
  className?: string;
}

export function FavoriteButton({ drink, className }: FavoriteButtonProps) {
  const { user } = useUser();
  const { data: favorites = new Set(), isLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  
  // Don't render if no user or still loading
  if (!user || isLoading) {
    return null;
  }

  const isFavorited = favorites.has(drink.id!);

  const handleClick = () => {    
    toggleFavorite.mutate({ 
      drinkId: drink.id!, 
      isFavorited 
    });
  };

  return (
    <button
      type='button'
      disabled={toggleFavorite.isPending}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleClick}
     >
      <Heart
        className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
          isFavorited
            ? 'text-red-500 fill-current'
            : 'text-(--color-primary)  hover:text-red-500'
        } ${
          toggleFavorite.isPending ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      />
    </button>
  );
}