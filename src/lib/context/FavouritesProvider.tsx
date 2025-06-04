import { createContext, useContext, ReactNode } from 'react';
import { useFavorites, useToggleFavorite } from '../hooks/useFavourites';
import { Drink } from '../types';

type FavoritesContextType = {
  favoritedDrinks: Set<number>;
  toggleFavorite: (drink: Drink) => Promise<void>;
  isFavorited: (drinkId: number) => boolean;
  fetchUserFavorites: () => Promise<void>;
};


const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
   const favoritesQuery = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const contextValue: FavoritesContextType = {
    favoritedDrinks: favoritesQuery.data || new Set(),
    
    toggleFavorite: async (drink: Drink) => {
      const isFavorited = favoritesQuery.data?.has(drink.id) || false;
      await toggleFavoriteMutation.mutateAsync({
        drinkId: drink.id,
        isFavorited,
      });
    },
    
    isFavorited: (drinkId: number) => {
      return favoritesQuery.data?.has(drinkId) || false;
    },
    
    fetchUserFavorites: async () => {
      await favoritesQuery.refetch();
    },
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}