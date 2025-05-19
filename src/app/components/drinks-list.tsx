"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Drink } from "../../lib/types";
import { createSupabaseClient } from "../../lib/supabase-client";

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
          <Input placeholder="Search drinks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink) => (
          <Card key={drink.name} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              <Image src={/* drink.image || */ "/placeholder.svg"} alt={drink.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{drink.name}</h3>
                  <p className="text-sm text-muted-foreground">{drink.store}</p>
                </div>
                <Badge variant="outline">{drink.price.toFixed(2)}€</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {drink.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={drink.url} target="_blank" rel="noopener noreferrer">
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
