"use client"

import { useState, useEffect } from "react"
import { useDrinks } from "../../lib/hooks/useDrinks"
import Image from "next/image"
import { ExternalLink, ChevronDown, LucidePlus, LucideX } from "lucide-react"
import { Drink } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase-client";

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "../../lib/utils"


export async function fetchDrinks(): Promise<Drink[]> {
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


export function DrinksList() {
   const {
    filteredDrinks,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    activeCardId,
    toggleCardOverlay,
    refreshDrinks
  } = useDrinks();
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Functional Drinks</h1>
        <div className="w-1/3">
          <Input className="rounded-full" placeholder="Search drinks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>


        {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-secondary)]"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink, index) => (
          <Card key={drink.name} className="overflow-hidden relative">
            <div className="aspect-square relative bg-muted">
                <Badge variant="outline" className="absolute top-2 right-2 z-8 bg-(--color-secondary) text-(--color-primary) text-(length:--fs-p) rounded-full border-none px-[16px] py-[6px]">{drink.price.toFixed(2)}€</Badge>
              <Image src={ drink.image || "/placeholder.svg"} alt={drink.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-(length:--fs-h6)">{drink.name}</h3>
                </div>
              </div>

               {drink.tags && drink.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {drink.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-(length:--fs-small) rounded-full px-4 py-1.5 text-(--color-bg--light) bg-(--color-secondary)">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

              <div className="mt-2 flex">
                <Collapsible className="border rounded-md w-full">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-between cursor-pointer w-full">
                        <span>Ingredients</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 space-y-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  {drink.ingredients.map((ingredient) => (
                    <div key={ingredient} className="flex items-center space-x-2">

                      <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
                    </div>
                  ))}
                </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2 justify-end relative">
                   <div 
                   className="flex justify-between items-center pl-[22px] pr-[8px] gap-4 rounded-full py-2 bg-(--color-bg) cursor-pointer z-10"
                    onClick={() => toggleCardOverlay(index)}
                   >
                    <span>{activeCardId === index ? 'Close overlay' : 'View ingredients'}</span>
                    <div className="bg-(--color-white) rounded-full p-2">
                        <LucidePlus 
                        className={`h-4 w-4 text-[var(--color-bg)] transition-transform duration-200 ${
                          activeCardId === index ? 'rotate-45' : ''
                        }`}
                        />
                    </div>
                  </div>
            </CardFooter>
            {activeCardId === index && (
              <div className="absolute inset-0 bg-(--color-secondary) text-(--color-bg) flex flex-col px-6 pb-6 pt-4 z-9">
                <h4>Ingredients</h4>
                <ul className="list-disc pl-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {drink.ingredients.map((ingredient) => (
                    <li key={ingredient} className="text-(length:--fs-p)">{ingredient}</li>
                  ))}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-secondary)] to-transparent backdrop-blur-[1px] pointer-events-none"></div>
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
      )}
    </div>
  )
}
