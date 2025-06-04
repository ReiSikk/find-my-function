import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useCallback } from 'react'


// Fetch user's favorites from supabase
export function useFavorites() {
  const { user } = useUser();
  const { session } = useSession();

  // Create authenticated client
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
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async (): Promise<Set<number>> => {
      if (!user?.id) return new Set();
      
      const client = createClerkSupabaseClient();
      const { data, error } = await client
        .from('user_drinks')
        .select('drink_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return new Set(data.map(item => item.drink_id));
    },
    enabled: !!user?.id,
    staleTime: 60 * 60 * 1000, // 60 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary calls
  });
}

// Toggle favorite - direct supabase mutations
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { session } = useSession();

  // Create authenticated client
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

  return useMutation({
    mutationFn: async ({ drinkId, isFavorited }: { drinkId: number; isFavorited: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated')
        
      const client = createClerkSupabaseClient();;

      // Remove from favorites
      if (isFavorited) {
        const { error } = await client
          .from('user_drinks')
          .delete()
          .eq('user_id', user.id)
          .eq('drink_id', drinkId);
        
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await client
          .from('user_drinks')
          .insert({
            user_id: user.id,
            drink_id: drinkId,
          });
        
        if (error) throw error;
      }
      
      return { drinkId, isFavorited };
    },
    
    // Optimistic updates for instant UI feedback
    onMutate: async ({ drinkId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });
      
      // Save current state for rollback
      const previousFavorites = queryClient.getQueryData<Set<number>>(['favorites', user?.id]);
      
      // Update UI
      queryClient.setQueryData<Set<number>>(['favorites', user?.id], (old = new Set()) => {
        const newSet = new Set(old);
        if (isFavorited) {
          newSet.delete(drinkId);
        } else {
          newSet.add(drinkId);
        }
        return newSet;
      });
      
      return { previousFavorites };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', user?.id], context.previousFavorites);
      }
      console.error('Error toggling favorite:', err);
    },
    
    onSuccess: () => {
      // Refresh the favorites data to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });
}
