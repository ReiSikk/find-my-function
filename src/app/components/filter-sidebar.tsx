"use client"

import { useState } from "react"
import { ChevronDown, ChevronDownCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Sample ingredients - you'll replace these with actual data from your scraper
const sampleIngredients = [
  "Caffeine",
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
    <div className="bg-(--color-primary) py-(--pb-cards) px-(--pi-cards) rounded-md min-h-[300px] flex flex-col h-auto">
        <h2 className="text-(length:--fs-h6) font-semibold py-3">Filters</h2>

      <div className="flex-col gap-4 mt-auto">
      <Collapsible defaultOpen className="space-y-3 border-b">
        <CollapsibleTrigger asChild className="p-0">
          <Button variant="ghost" className="flex w-full justify-between py-4  cursor-pointer">
            <span className="text-(length:--fs-p)">Ingredients</span>
            <ChevronDownCircle className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {sampleIngredients.map((ingredient) => (
            <div key={ingredient} className="flex items-center space-x-2">
              <Checkbox
                id={`ingredient-${ingredient}`}
                checked={selectedIngredients.includes(ingredient)}
                onCheckedChange={() => toggleIngredient(ingredient)}
                className="cursor-pointer"
              />
              <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="space-y-3 border-b">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-4 cursor-pointer">
            <span className="text-(length:--fs-p)">Stores</span>
            <ChevronDownCircle className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-2 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="flex items-center space-x-2">
            <Checkbox id="store-selver" className="cursor-pointer" />
            <Label htmlFor="store-selver">E-Selver</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="store-rimi" className="cursor-pointer" />
            <Label htmlFor="store-rimi">Rimi</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

        <Button className="w-full bg-(--color-bg--light) text-(--color-secondary) text-(length:--fs-p) cursor-pointer rounded-full mt-4">Apply filters</Button>
      </div>
    </div>
  )
}
