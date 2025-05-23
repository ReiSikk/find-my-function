"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PriceRangeSelectorProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onRangeChange: (values: [number, number]) => void;
  onReset: () => void;
}

export default function PriceRangeSelector({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onRangeChange,
  onReset
}: PriceRangeSelectorProps) {
  return (
    <div className="grid gap-4 px-1.5 py-3">
      <div className="flex items-center justify-between">
        <span className="text-[var(--color-text)] font-medium">
          {`Price range: ${minPrice}€ - ${maxPrice}€`}
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onReset}
          className="text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] text-(length:--fs-small) cursor-pointer"
        >
          Reset
        </Button>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[minPrice, maxPrice]}
        onValueChange={(values) => onRangeChange(values as [number, number])}
        className="w-full"
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Label htmlFor="min-price" className="pb-2">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="max-price" className="pb-2">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}