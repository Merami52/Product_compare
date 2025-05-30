"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Trash2, MessageCircle } from "lucide-react"
import { useComments } from "@/hooks/use-comments"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { AuthDialog } from "@/components/auth/auth-dialog"

interface ProductCommentsProps {
  productId: string
}

export function ProductComments({ productId }: ProductCommentsProps) {
  const { getCommentsForProduct, addComment, deleteComment, isLoaded } = useComments()
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const productComments = getCommentsForProduct(productId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) return

    setIsSubmitting(true)
    try {
      addComment(productId, authorName.trim(), newComment.trim(), rating)
      setNewComment("")
      setAuthorName("")
      setRating(5)
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Загрузка отзывов...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Отзывы пользователей ({productComments.length})</h3>
      </div>

      {/* Add new comment form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Оставить отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Ваше имя</Label>
                  <Input
                    id="author"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Оценка</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={cn(
                          "p-1 rounded hover:bg-gray-100 transition-colors",
                          star <= rating ? "text-yellow-400" : "text-gray-300",
                        )}
                      >
                        <Star className={cn("h-5 w-5", star <= rating && "fill-current")} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Ваш отзыв</Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Поделитесь своим мнением о товаре..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !newComment.trim() || !authorName.trim()}>
                {isSubmitting ? "Отправка..." : "Отправить отзыв"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Войдите, чтобы оставить отзыв</h3>
            <p className="text-muted-foreground mb-4">Для написания отзывов необходимо войти в систему</p>
            <Button onClick={() => setAuthDialogOpen(true)}>Войти в систему</Button>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {productComments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Пока нет отзывов. Будьте первым!</p>
            </CardContent>
          </Card>
        ) : (
          productComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteComment(comment.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed">{comment.text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}
