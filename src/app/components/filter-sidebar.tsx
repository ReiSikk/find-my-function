"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
    <div className="bg-(--color-primary) py-(--pb-cards) px-(--pi-cards) rounded-md flex flex-col h-auto">
      <div className="sm:flex-col lg:flex-row items-center justify-between w-full gap-2">
        <h2 className="text-(length:--fs-h6) font-medium py-3">Filters</h2>
        <Button className="s bg-[var(--color-bg--light)] text-[var(--color-secondary)] rounded-full border border-transparent hover:border-[var(--color-secondary)]">
          Apply filters
        </Button>
      </div>


      <div className="flex-col gap-4 mt-auto">
       <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="">
          <AccordionTrigger className="text-(length:--fs-p) cursor-pointer hover:bg-(--color-bg) px-3 py-3">Is it accessible?</AccordionTrigger>
          <AccordionContent className="flex flex-col px-1.5 py-3">
            <span
              className="mb-2 underline underline-offset-2 cursor-pointer text-(length:--fs-small)"
              onClick={() => setSelectedIngredients([])}
            >
              Clear all
            </span>
            {sampleIngredients.map((ingredient) => (
              <div key={ingredient} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`ingredient-${ingredient}`}
                  checked={selectedIngredients.includes(ingredient)}
                  onCheckedChange={() => toggleIngredient(ingredient)}
                  className="cursor-pointer"
                />
                <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="">
          <AccordionTrigger className="text-(length:--fs-p) cursor-pointer hover:bg-(--color-bg) px-3 py-3">Stores</AccordionTrigger>
          <AccordionContent className="flex flex-col px-1.5 py-3">
            <span
              className="mb-2 underline underline-offset-2 cursor-pointer text-(length:--fs-small)"
              onClick={() => setSelectedIngredients([])}
            >
              Clear all
            </span>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="store-selver"
                  className="cursor-pointer"
                />
                <Label htmlFor="store-selver">E-Selver</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="store-rimi"
                  className="cursor-pointer"
                />
                <Label htmlFor="store-rimi">Rimi</Label>
              </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  )
}
