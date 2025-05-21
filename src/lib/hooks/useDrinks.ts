// src/lib/hooks/useDrinks.ts
import { useState, useEffect } from 'react';
import { Drink } from '../types';
import { createSupabaseClient } from '../supabase-client';
import useSWR from 'swr';

async function fetchDrinks(): Promise<Drink[]> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('drinks')
    .select('*')
    .order('price', { ascending: true });
    
  if (error) {
    console.error("Error fetching drinks:", error);
    throw new Error("Failed to load drinks data");
  }
  
  return data || [];
}

export function useDrinks(initialSearchTerm = '') {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  
  // Use SWR for data fetching with caching
  const { 
    data: drinks, 
    error, 
    isLoading,
    mutate: refreshDrinks
  } = useSWR('drinks', fetchDrinks, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 3600000, // Cahce for 1 hour
  });
  
  // Filter drinks based on search term
  const filteredDrinks = drinks 
    ? drinks.filter((drink) => drink.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  // Toggle card overlay
  const toggleCardOverlay = (index: number) => {
    setActiveCardId(prevId => prevId === index ? null : index);
  };
  
  return {
    drinks,
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    loading: isLoading,
    error: error ? "Failed to load drinks. Please try again later." : null,
    activeCardId,
    toggleCardOverlay,
    refreshDrinks
  };
}