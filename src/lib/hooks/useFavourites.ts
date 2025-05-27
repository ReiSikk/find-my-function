import { useState, useEffect, useCallback } from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Drink } from '../types';

interface UseFavoritesOptions {
    onFavoriteChange?: () => void; // Callback when favorites change
}

export function useFavorites(options?: UseFavoritesOptions) {
  const [favoritedDrinks, setFavoritedDrinks] = useState<Set<number>>(new Set());
  const { user } = useUser();
  const { session } = useSession();

  // Extract callback from options
  const { onFavoriteChange } = options || {};

  // Create Clerk-authenticated Supabase client
  const createClerkSupabaseClient = useCallback(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      },
    );
  }, [session]);

  // Fetch user's current favorites
  const fetchUserFavorites = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const client = createClerkSupabaseClient();
      const { data, error } = await client
        .from('user_drinks')
        .select('drink_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user favorites:', error);
        return;
      }
      
      const favoriteIds = new Set(data.map(item => item.drink_id));
      setFavoritedDrinks(favoriteIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }, [user?.id, createClerkSupabaseClient]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (drink: Drink) => {
    if (!user?.id) return;
    
    const isFavorited = favoritedDrinks.has(drink.id!);
    
    try {
      const client = createClerkSupabaseClient();
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await client
          .from('user_drinks')
          .delete()
          .eq('user_id', user.id)
          .eq('drink_id', drink.id);
        
        if (error) {
          console.error('Error removing from favorites:', error);
          return;
        }
        
        // Update local state
        setFavoritedDrinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(drink.id!);
          return newSet;
        });

        
        console.log('Drink removed from favorites');
      } else {
        // Add to favorites
        const { error } = await client
          .from('user_drinks')
          .insert([{
            user_id: user.id,
            drink_id: drink.id,
          }]);
        
        if (error) {
          console.error('Error adding to favorites:', error);
          return;
        }
        
        // Update local state
        setFavoritedDrinks(prev => new Set([...prev, drink.id!]));
        console.log('Drink added to favorites');
      }

      // Call the refresh callback func if provided
        if (onFavoriteChange) {
          onFavoriteChange();
        }

    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [user?.id, favoritedDrinks, createClerkSupabaseClient, onFavoriteChange]);

  // Check if a drink is favorited
  const isFavorited = useCallback((drinkId: number) => {
    return favoritedDrinks.has(drinkId);
  }, [favoritedDrinks]);

  // Fetch favorites when user loads
  useEffect(() => {
    if (user?.id) {
      fetchUserFavorites();
    }
  }, [user?.id, fetchUserFavorites]);

  return {
    favoritedDrinks,
    toggleFavorite,
    isFavorited,
    fetchUserFavorites,
  };
}