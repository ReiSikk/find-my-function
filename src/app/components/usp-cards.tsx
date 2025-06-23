import React from 'react'
import { Filter, BarChart3, Sparkles, LucideArrowRight } from "lucide-react"

export default function UspCards() {

  return (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="uspCard text-center group flex flex-col items-center justify-center">
            <div className="btn-main btn-reveal--top txt-small" role='button' aria-label='Additional information button'>
                <span>
                    Find the right drink for you
                </span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 group-hover:scale-105">
                <Filter className="w-8 h-8 text-(--color-bg)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-bg) mb-3">Ingredient Filtering</h3>
            <p className="text-(--color-bg) txt-small leading-relaxed opacity-70">
                Find drinks based on electrolytes, caffeine, or vitamins.
            </p>
           <svg className="extra-bg " width="182" height="46" viewBox="0 0 182 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 0.5H181.085V45.5H0.0850029L39 0.5Z" fill="#F4F1E0"/>
            </svg>
            <div className="txt-slide--lr flex items-center nowrap">
                <span className='font-semibold'>Learn more</span>
                <LucideArrowRight className="w-4 h-4" />
            </div>
        </div>

        <div className="uspCard text-center group flex flex-col items-center justify-center">
            <div className="btn-main btn-reveal--top txt-small" role='button' aria-label='Additional information button'>
                <span>
                    Find the best prices
                </span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 group-hover:scale-105">
                <BarChart3 className="w-8 h-8 text-(--color-bg)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-bg) mb-3">Store Comparison</h3>
            <p className="text-(--color-bg) txt-small leading-relaxed opacity-70">
                Compare prices across multiple Estonian grocery stores.
            </p>
            <svg className="extra-bg " width="182" height="46" viewBox="0 0 182 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 0.5H181.085V45.5H0.0850029L39 0.5Z" fill="#F4F1E0"/>
            </svg>
            <div className="txt-slide--lr flex items-center nowrap">
                <span className='font-semibold'>Learn more</span>
                <LucideArrowRight className="w-4 h-4" />
            </div>
        </div>

             <div className="uspCard text-center group flex flex-col items-center justify-center">
            <div className="btn-main btn-reveal--top txt-small" role='button' aria-label='Additional information button'>
                <span>
                    Get reccomendations
                </span>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 group-hover:scale-105">
                <Sparkles className="w-8 h-8 text-(--color-bg)" />
            </div>
            <h3 className="text-xl font-semibold text-(--color-bg) mb-3">Smart Recommendations</h3>
            <p className="text-(--color-bg) txt-small leading-relaxed opacity-70">
                Get personalized suggestions for running, lifting, or recovering.
            </p>
            <svg className="extra-bg " width="182" height="46" viewBox="0 0 182 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 0.5H181.085V45.5H0.0850029L39 0.5Z" fill="#F4F1E0"/>
            </svg>
            <div className="txt-slide--lr flex items-center nowrap">
                <span className='font-semibold'>Learn more</span>
                <LucideArrowRight className="w-4 h-4" />
            </div>
        </div>
       </div>
  )
}