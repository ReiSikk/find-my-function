"use client"

import type React from "react"

import { useState } from "react"
import { Filter, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching for:", searchQuery)
  }

  return (
    <section className="relative bg-(--color-bg) py-20 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--color-primary))_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-(--color-primary) mb-8 tracking-tight">
          Fuel Your Flow.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-(--color-primary) mb-12 max-w-3xl mx-auto leading-relaxed opacity-70">
          Find the best hydration, energy, and recovery drinks—
          <br className="hidden sm:block" />
          filtered by real ingredients and built for performance.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-16 max-w-2xl mx-auto">
          <div className="flex rounded-lg overflow-hidden shadow-lg bg-(--color-bg) border border-[hsl(var(--color-primary)/0.2)]">
            <Input
              type="text"
              placeholder="Search for hydration, energy, or recovery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-(--color-primary) placeholder:text-[hsl(var(--color-primary)/0.5)] focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-6 py-4"
            />
            <Button
              type="submit"
              className="bg-(--color-primary) hover:bg-[hsl(var(--color-primary)/0.9)] text-[hsl(var(--color-bg))] px-8 py-4 rounded-none font-medium border-0"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--color-primary)/0.1)] hover:bg-[hsl(var(--color-primary)/0.15)] rounded-2xl mb-6 transition-all duration-200 group-hover:scale-105">
              <Filter className="w-8 h-8 text-(--color-primary)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-primary) mb-3">Ingredient Filtering</h3>
            <p className="text-(--color-primary) leading-relaxed opacity-70">
              Find drinks based on electrolytes, caffeine, or vitamins.
            </p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--color-primary)/0.1)] hover:bg-[hsl(var(--color-primary)/0.15)] rounded-2xl mb-6 transition-all duration-200 group-hover:scale-105">
              <BarChart3 className="w-8 h-8 text-(--color-primary)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-primary) mb-3">Store Comparison</h3>
            <p className="text-(--color-primary) leading-relaxed opacity-70">
              Compare availability and price across multiple Estonian grocery stores.
            </p>
          </div>

          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(var(--color-primary)/0.1)] hover:bg-[hsl(var(--color-primary)/0.15)] rounded-2xl mb-6 transition-all duration-200 group-hover:scale-105">
              <Sparkles className="w-8 h-8 text-(--color-primary)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-primary) mb-3">Smart Recommendations</h3>
            <p className="text-(--color-primary) leading-relaxed opacity-70">
              Get personalized suggestions for running, lifting, or recovering.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
