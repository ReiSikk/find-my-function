"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink, ChevronDown } from "lucide-react"
import { Drink } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase-client";

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


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

  console.log("Fetched drinks from Supabase:", data);
  
  return data || [];
}


export function DrinksList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  console.log(drinks);

    // Fetch drinks when component mounts
  useEffect(() => {
    async function loadDrinks() {
      try {
        setLoading(true)
        const data = await fetchDrinks()
        console.log("Fetched drinks:", data)
        setDrinks(data)
      } catch (err) {
        console.error("Failed to fetch drinks:", err)
        setError("Failed to load drinks. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadDrinks()
  }, [])

  const filteredDrinks = drinks.filter((drink) => drink.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Functional Drinks</h1>
        <div className="w-1/3">
          <Input className="rounded-full" placeholder="Search drinks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink) => (
          <Card key={drink.name} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
                <Badge variant="outline" className="absolute top-2 right-2 z-10 bg-(--color-secondary) text-(--color-primary) text-(length:--fs-p) rounded-full border-none px-[16px] py-[6px]">{drink.price.toFixed(2)}€</Badge>
              <Image src={ /* drink.image || */ "/placeholder.svg"} alt={drink.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-(length:--fs-h6)">{drink.name}</h3>
                  <p className="text-sm text-muted-foreground">{drink.store}</p>
                </div>
              </div>
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
            <CardFooter className="p-4 pt-0 hover:*:bg-gray-200">
              <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
                <a href={drink.url} target="_blank" rel="noopener noreferrer" className="py-[10px] w-full bg-(--color-bg--light) text-(--color-secondary) text-(length:--fs-p) cursor-pointer rounded-full mt-4">
                  View in Store
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
