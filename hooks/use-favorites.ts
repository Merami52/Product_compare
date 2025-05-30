"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "product-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const favoriteIds = JSON.parse(saved)
        setFavorites(new Set(favoriteIds))
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error)
      }
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)))
  }, [favorites])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const isFavorite = (productId: string) => favorites.has(productId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
