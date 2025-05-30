"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"

const STORAGE_KEY = "product-comparison"

export function useComparison() {
  const [comparisonItems, setComparisonItems] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window !== "undefined") {
          // Load from localStorage
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            try {
              const parsedData = JSON.parse(saved)
              if (Array.isArray(parsedData)) {
                setComparisonItems(parsedData)
              }
            } catch (error) {
              console.error("Error loading comparison from localStorage:", error)
              localStorage.removeItem(STORAGE_KEY)
            }
          }
        }
      } catch (error) {
        console.error("Error loading comparison data:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  // Save to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonItems))
      } catch (error) {
        console.error("Error saving comparison to localStorage:", error)
      }
    }
  }, [comparisonItems, isLoaded])

  const addToComparison = (product: Product) => {
    setComparisonItems((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev
      }
      if (prev.length >= 4) {
        // Remove first item if we have 4 items already
        return [...prev.slice(1), product]
      }
      return [...prev, product]
    })
  }

  const removeFromComparison = (productId: string) => {
    setComparisonItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearComparison = () => {
    setComparisonItems([])
  }

  return {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isLoaded,
  }
}
