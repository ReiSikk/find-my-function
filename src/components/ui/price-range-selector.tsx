"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react'

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
    const [sliderValue, setSliderValue] = useState<[number, number]>([minPrice, maxPrice]);
    // Update slider values
      // Update slider when min/max prices change
    useEffect(() => {
      setSliderValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

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
          className="text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] txt-p cursor-pointer"
        >
          Reset
        </Button>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={sliderValue}
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