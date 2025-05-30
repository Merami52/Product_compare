"use client"

import { useState, useEffect } from "react"

export interface Comment {
  id: string
  productId: string
  author: string
  text: string
  rating: number
  timestamp: number
}

const STORAGE_KEY = "product-comments"

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedComments = JSON.parse(saved)
        if (Array.isArray(parsedComments)) {
          setComments(parsedComments)
        }
      }
    } catch (error) {
      console.error("Error loading comments from localStorage:", error)
      // Reset localStorage if corrupted
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever comments change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
      } catch (error) {
        console.error("Error saving comments to localStorage:", error)
      }
    }
  }, [comments, isLoaded])

  const addComment = (productId: string, author: string, text: string, rating: number) => {
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      author,
      text,
      rating,
      timestamp: Date.now(),
    }
    setComments((prev) => [newComment, ...prev])
    return newComment
  }

  const getCommentsForProduct = (productId: string) => {
    return comments.filter((comment) => comment.productId === productId).sort((a, b) => b.timestamp - a.timestamp)
  }

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId))
  }

  const getCommentsCount = (productId: string) => {
    return comments.filter((comment) => comment.productId === productId).length
  }

  return {
    comments,
    addComment,
    getCommentsForProduct,
    deleteComment,
    getCommentsCount,
    isLoaded,
  }
}
