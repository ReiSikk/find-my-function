"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { LucideArrowRight } from "lucide-react"
import UspCards from "./usp-cards"

export function HeroSection() {
  // Hero dynamic section animations
  const KEYWORDS = ["hydration", "energy", "recovery", "protein", "electrolyte"];
  const keywordsLoop = [...KEYWORDS, KEYWORDS[0]];
  const [keywordIndex, setKeywordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true);

useEffect(() => {
  const interval = setInterval(() => {
    setKeywordIndex((prev) => {
      if (prev === KEYWORDS.length) {
        setIsAnimating(false); // Disable animation for the jump
        return 1; // Jump to the real first keyword (index 1)
      } else {
        setIsAnimating(true); // Enable animation
        return prev + 1;
      }
    });
  }, 2000);
  return () => clearInterval(interval);
}, [KEYWORDS.length]);



  return (
    <section className="relative bg-(--color-bg) py-20 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-(--color-primary) mb-8 tracking-tight">
          Fuel Your Tempo.
        </h1>

        <div className="pos relative text-lg sm:text-xl text-(--color-primary) mb-12 max-w-3xl mx-auto leading-relaxed opacity-70 flex justify-center flex-wrap">
          <span className="text-nowrap">Find the best&nbsp;</span>
          <span className="relative inline-block h-[1.5em] overflow-hidden align-middle">
            <span
              className={`flex flex-col ${isAnimating ? "transition-transform duration-500" : ""}`}
            >
                {keywordsLoop.map((word, i) => (
                  <span
                    key={i}
                    className="font-semibold text-(--color-primary) text-(length:--fs-h6)"
                    aria-hidden={keywordIndex !== i}
                    style={{
                      transform: `translateY(-${keywordIndex * 100}%)`,
                      opacity: keywordIndex === i ? 1 : 0,
                      transition: isAnimating ? "transform 0.5s ease-in-out, opacity 0.5s ease-in-out" : "none"
                    }}
                    onTransitionEnd={() => {
                      // If we just jumped, reset index to 1 (real first keyword)
                      if (keywordIndex === KEYWORDS.length) {
                        setIsAnimating(false);
                        setKeywordIndex(1);
                      }
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </span>
          <span className="text-nowrap">&nbsp;products, built for performance.</span>
        </div>

        <Link
          href="/account"
          className="btn-main mb-16 max-w-2xl mx-auto"
          prefetch={true}
        >
          <span>Fuel your tempo</span>
          <LucideArrowRight className="w-4 h-4" />
        </Link>
        <UspCards />
      </div>
    </section>
  )
}
