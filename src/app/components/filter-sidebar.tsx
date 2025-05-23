"use client"

import { Button } from "@/components/ui/button"
import { useDrinksContext } from "@/lib//context/DrinksContext"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import PriceRangeSelector from "@/components/ui/price-range-selector"
import { DRINK_CATEGORIES, MERCHANTS } from "@/lib/constants"



export function FilterSidebar() {
   const {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    activeFilters,
    handlePriceRangeChange,
    selectedIngredients,
    handleDrinkCategoryChange,
    handleMerchantChange,
    resetFilters,
  } = useDrinksContext();

  return (
    <div className="bg-(--color-primary) py-(--pb-cards) px-(--pi-cards) rounded-md flex flex-col h-auto">
      <div className="flex items-center justify-between w-full gap-2 pb-2">
        <h2 className="text-(length:--fs-h6) font-medium py-3">Filters</h2>
        <Button 
        className="cursor-pointer bg-[var(--color-bg--light)] text-[var(--color-secondary)] rounded-full border border-transparent hover:border-[var(--color-secondary)]"
        onClick={resetFilters}
        >
          Reset filters
        </Button>
      </div>


      <div className="flex-col gap-4 mt-auto">
       <Accordion type="multiple" defaultValue={["item-1"]}  className="w-full">
        <AccordionItem value="item-1" className="">
          <AccordionTrigger className="text-(length:--fs-p) cursor-pointer hover:bg-(--color-bg) px-3 py-3">Functional ingredients</AccordionTrigger>
          <AccordionContent className="flex flex-col px-3 py-3">
            <span
              className="mb-2 underline underline-offset-2 cursor-pointer text-(length:--fs-small)"
            >
              Clear all
            </span>
            {DRINK_CATEGORIES.map((ingredient) => (
              <div key={ingredient} className="flex items-center space-x-2 py-2">
                 <Checkbox
                    checked={selectedIngredients.includes(ingredient)}
                  onCheckedChange={() => handleDrinkCategoryChange(ingredient)}
                    id={`ingredient-${ingredient}`}
                  />
                <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="">
          <AccordionTrigger className="text-(length:--fs-p) cursor-pointer hover:bg-(--color-bg) px-3 py-3">Stores</AccordionTrigger>
          <AccordionContent className="flex flex-col px-3 py-3">
          {MERCHANTS.map((merchant) => (
              <div key={merchant} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`merchant-${merchant}`}
                  checked={activeFilters.selectedMerchants.includes(merchant)}
                  className="cursor-pointer"
                  onCheckedChange={() => handleMerchantChange(merchant)}
                />
                <Label htmlFor="store-selver">{merchant}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="">
          <AccordionTrigger className="text-(length:--fs-p) cursor-pointer hover:bg-(--color-bg) px-3 py-3">Price range</AccordionTrigger>
          <AccordionContent className="flex flex-col px-1.5 py-3">
            <PriceRangeSelector
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onRangeChange={handlePriceRangeChange}
              onReset={resetFilters}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  )
}
