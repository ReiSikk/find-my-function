"use client";

import { createContext, useContext } from "react";
import { useDrinks } from "../hooks/useDrinks";

const DrinksContext = createContext<ReturnType<typeof useDrinks> | null>(null);

export function DrinksProvider({ children }: { children: React.ReactNode }) {
  const drinks = useDrinks();
  return (
    <DrinksContext.Provider value={drinks}>
      {children}
    </DrinksContext.Provider>
  );
}

export function useDrinksContext() {
  const context = useContext(DrinksContext);
  if (!context) {
    throw new Error("useDrinksContext must be used within a DrinksProvider");
  }
  return context;
}
