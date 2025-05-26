import { Heart } from 'lucide-react';
import { Drink } from '../../lib/types';
import { useUser } from '@clerk/nextjs';

interface FavoriteButtonProps {
  drink: Drink;
  isFavorited: boolean;
  onToggleFavorite: (drink: Drink) => void;
  className?: string;
}

export function FavoriteButton({ 
  drink, 
  isFavorited, 
  onToggleFavorite, 
  className = '' 
}: FavoriteButtonProps) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const handleClick = () => {
    console.log("Heart clicked for drink:", drink.name);
    onToggleFavorite(drink);
  };

  return (
    <Heart
      className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
        isFavorited
          ? 'text-red-500 fill-current'
          : 'text-[var(--color-secondary)] hover:text-[var(--color-white)]'
      } ${className}`}
      onClick={handleClick}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    />
  );
}