import { useState, useCallback, useMemo } from 'react';
import { Drink } from '../types';
import { createSupabaseClient } from '../supabase-client';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 12;

async function fetchDrinksPage({ 
  pageParam = 0 
}: { 
  pageParam: number 
}): Promise<{ drinks: Drink[], hasMore: boolean, nextPage: number | null, totalCount: number }> {
  const supabase = createSupabaseClient();
  
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  
  const { data, error, count } = await supabase
    .from('drinks')
    .select('*', { count: 'exact' })
    .order('price', { ascending: true })
    .range(from, to);
    
  if (error) {
    console.error("Error fetching drinks:", error);
    throw new Error("Failed to load drinks data");
  }
  
  const drinks = data || [];
  const totalCount = count || 0;
  const hasMore = (pageParam + 1) * PAGE_SIZE < totalCount;
  const nextPage = hasMore ? pageParam + 1 : null;
  
  return {
    drinks,
    hasMore,
    nextPage,
    totalCount,
  };
}

export function useDrinks(initialSearchTerm = '') {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  // Active filters (currently applied)
  const [activeFilters, setActiveFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    selectedIngredients: [] as string[],
    selectedMerchants: [] as string[]
  });

  
  // Pending filters (not yet applied)
  const [pendingMinPrice, setPendingMinPrice] = useState(0);
  const [pendingMaxPrice, setPendingMaxPrice] = useState(100);
  
  // Use infinite query for pagination
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ["drinks"],
    queryFn: fetchDrinksPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

   // Flatten all pages into a single array
  const drinks = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.drinks);
  }, [data]);

    // Get total count from first page
  const totalCount = useMemo(() => {
    return data?.pages?.[0]?.totalCount || 0;
  }, [data]);

  // Calculate how many items are currently loaded
  const loadedCount = drinks.length;


  
  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setPendingMinPrice(0);
    setPendingMaxPrice(100);
    setSearchTerm('');
    
    // Immediately apply the reset
    setActiveFilters({
      minPrice: 0,
      maxPrice: 100,
      selectedIngredients: [],
      selectedMerchants: []
    });
  }, []);
  

  
// Handle drink category change
const handleDrinkCategoryChange = useCallback((category: string) => {

   setActiveFilters(prev => {
    const isSelected = prev.selectedIngredients.includes(category);
    
    const newIngredients = isSelected
      ? prev.selectedIngredients.filter(item => item !== category)
      : [...prev.selectedIngredients, category];
      
    // console.log('New selection:', newIngredients);
    
    return {
      ...prev,
      selectedIngredients: newIngredients
    };
  });
}, []);

// Function to clear selected ingredient categories
const clearIngredients = useCallback(() => {
  setActiveFilters(prev => ({
    ...prev,
    selectedIngredients: []
  }));
}, []);


// Handle store selection change
const handleMerchantChange = useCallback((merchant: string) => {
  setActiveFilters(prev => {
    // Check if this merchant is already selected
    const isSelected = prev.selectedMerchants.includes(merchant);
    
    // Toggle merchant selection
    const newMerchants = isSelected
      ? prev.selectedMerchants.filter(item => item !== merchant)
      : [...prev.selectedMerchants, merchant];
    
    return {
      ...prev,
      selectedMerchants: newMerchants
    };
  });
}, []);


  // Handle slider range change (updates pending values only)
const handlePriceRangeChange = useCallback(([min, max]: [number, number]) => {
  // Update pending values for the slider UI
  setPendingMinPrice(min);
  setPendingMaxPrice(max);
  
  // Immediately apply to active filters
  setActiveFilters(prev => ({
    ...prev,
    minPrice: min,
    maxPrice: max
  }));
}, []);

// Reset price
const resetPrice = useCallback(() => {
  setPendingMinPrice(0);
  setPendingMaxPrice(100);
  setActiveFilters(prev => ({
    ...prev,
    minPrice: 0,
    maxPrice: 100
  }));
}, []);



const filteredDrinks = useMemo(() => {
  if (!drinks) return [];


  const results = drinks.filter((drink) => {
    // Filter by search term 
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by price range
    const matchesPrice = drink.price >= activeFilters.minPrice && 
                        drink.price <= activeFilters.maxPrice;
    
    // Filter by ingredients (if any selected)
   const matchesIngredients =
      activeFilters.selectedIngredients.length === 0 ||
      activeFilters.selectedIngredients.every(ingredient =>
        drink.tags?.some(tag => tag.toLowerCase().includes(ingredient.toLowerCase()))
      );

    // Filter by merchants (if any selected)
    const matchesMerchant =   activeFilters.selectedMerchants.length === 0 || 
    activeFilters.selectedMerchants.includes(drink.store);
        

    // Return drinks that match all filters
    const matchesAll = matchesSearch && matchesPrice && matchesIngredients && matchesMerchant;
    return matchesAll;
  });

  return [...results];

}, [drinks, searchTerm, activeFilters]);


  
  // Toggle card overlay
  const [openOverlays, setOpenOverlays] = useState<Record<number, boolean>>({});

  const toggleCardOverlay = useCallback((index: number) => {
  setOpenOverlays(prev => ({
    ...prev,
    [index]: !prev[index]
  }));
}, []);


  // Check if pending filters differ from active filters
  const hasPendingChanges = useMemo(() => {
    return pendingMinPrice !== activeFilters.minPrice || 
           pendingMaxPrice !== activeFilters.maxPrice;
  }, [pendingMinPrice, pendingMaxPrice, activeFilters]);

  // Load more function
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  
  return {
     drinks,
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    // For drink categories
    selectedIngredients: activeFilters.selectedIngredients,
    handleDrinkCategoryChange,
    clearIngredients,
    // For merchants
    handleMerchantChange,
    // For price range (pending)
    minPrice: pendingMinPrice,
    maxPrice: pendingMaxPrice,
    setMinPrice: setPendingMinPrice,
    setMaxPrice: setPendingMaxPrice,
    handlePriceRangeChange,
    resetPrice,
    // Active filters state
    activeFilters,
    // Filter actions
    resetFilters,
    // Loading states
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore,
    // Counts
      // Counts
    totalCount,
    loadedCount,
    // Other state
    error: error ? "Failed to load drinks. Please try again later." : null,
    // Overlay states for cards
    openOverlays,
    toggleCardOverlay,
    refreshDrinks: refetch,
    hasPendingChanges
  };
}