"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Sample ingredients - you'll replace these with actual data from your scraper
const sampleIngredients = [
  "Caffeine",
  "Taurine",
  "B Vitamins",
  "Ginseng",
  "L-Carnitine",
  "Guarana",
  "Electrolytes",
  "Protein",
  "Collagen",
  "Magnesium",
]

export function FilterSidebar() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient],
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Filters</h2>

      <Collapsible defaultOpen className="border rounded-md">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-4">
            <span>Ingredients</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-2">
          {sampleIngredients.map((ingredient) => (
            <div key={ingredient} className="flex items-center space-x-2">
              <Checkbox
                id={`ingredient-${ingredient}`}
                checked={selectedIngredients.includes(ingredient)}
                onCheckedChange={() => toggleIngredient(ingredient)}
              />
              <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="border rounded-md">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-4">
            <span>Stores</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="store-selver" />
            <Label htmlFor="store-selver">E-Selver</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="store-rimi" />
            <Label htmlFor="store-rimi">Rimi</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
