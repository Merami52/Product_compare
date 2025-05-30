"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ContrastIcon as Compare, Star, Eye, MessageCircle } from "lucide-react"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/hooks/use-favorites"
import { useComments } from "@/hooks/use-comments"
import { ProductComments } from "@/components/product-comments"
import { useAuth } from "@/contexts/auth-context"
import { AuthDialog } from "@/components/auth/auth-dialog"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  isInComparison: boolean
  onAddToComparison: () => void
  onRemoveFromComparison: () => void
}

export function ProductCard({
  product,
  viewMode,
  isInComparison,
  onAddToComparison,
  onRemoveFromComparison,
}: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { getCommentsCount } = useComments()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dialogImageIndex, setDialogImageIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      setAuthDialogOpen(true)
      return
    }
    if (isInComparison) {
      onRemoveFromComparison()
    } else {
      onAddToComparison()
    }
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      setAuthDialogOpen(true)
      return
    }
    toggleFavorite(product.id)
  }

  const handleImageNavigation = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  const handleDialogImageNavigation = (index: number) => {
    setDialogImageIndex(index)
  }

  const handleCardClick = () => {
    setDialogImageIndex(currentImageIndex) // Sync dialog image with card image
    setIsDialogOpen(true)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-yellow-600"
    return "text-orange-600"
  }

  const userCommentsCount = getCommentsCount(product.id)

  const ProductDetailsDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Детали товара</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы пользователей ({userCommentsCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={product.images[dialogImageIndex] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-16 h-16 relative rounded border-2 overflow-hidden",
                            index === dialogImageIndex ? "border-primary" : "border-gray-200",
                          )}
                          onClick={() => handleDialogImageNavigation(index)}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-muted-foreground">{product.brand}</p>
                  </div>
                  <p className="text-sm">{product.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className={cn("text-sm font-medium", getRatingColor(product.rating))}>
                        {product.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">({product.reviewCount} базовых отзывов)</span>
                    </div>
                  </div>
                  {userCommentsCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{userCommentsCount} отзывов пользователей</span>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</div>
                  <Badge variant={product.inStock ? "default" : "secondary"}>
                    {product.inStock ? "В наличии" : "Нет в наличии"}
                  </Badge>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Характеристики:</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={isInComparison ? "default" : "outline"}
                      onClick={(e) => handleComparisonToggle(e)}
                      className="flex-1"
                    >
                      <Compare className="h-4 w-4 mr-2" />
                      {isInComparison ? "Убрать из сравнения" : "Добавить к сравнению"}
                    </Button>
                    <Button variant="outline" onClick={(e) => handleFavoriteToggle(e)}>
                      <Heart className={cn("h-4 w-4", isFavorite(product.id) && "fill-red-500 text-red-500")} />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ProductComments productId={product.id} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )

  if (viewMode === "list") {
    return (
      <>
        <Card
          className="flex flex-row overflow-hidden h-44 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleCardClick}
        >
          <div className="relative w-48 h-full flex-shrink-0">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 left-2 h-8 w-8 p-0 z-10"
              onClick={handleFavoriteToggle}
            >
              <Heart className={cn("h-3 w-3", isFavorite(product.id) && "fill-red-500 text-red-500")} />
            </Button>
            <Badge variant={product.inStock ? "default" : "secondary"} className="absolute top-2 right-2">
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </Badge>
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={cn("w-2 h-2 rounded-full", index === currentImageIndex ? "bg-white" : "bg-white/50")}
                    onClick={(e) => handleImageNavigation(e, index)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1 mr-3">
                  <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <span className={cn("text-sm font-medium", getRatingColor(product.rating))}>{product.rating}</span>
                {userCommentsCount > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {userCommentsCount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-xl font-bold">{product.price.toLocaleString()} ₽</div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant={isInComparison ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2"
                  onClick={handleComparisonToggle}
                >
                  <Compare className="h-3 w-3 mr-1" />
                  {isInComparison ? "Убрать" : "Сравнить"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDialogImageIndex(currentImageIndex)
                    setIsDialogOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <ProductDetailsDialog />
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </>
    )
  }

  return (
    <>
      <Card
        className="overflow-hidden group hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-square">
          <Image
            src={product.images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-2 left-2">
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={handleFavoriteToggle}>
              <Heart className={cn("h-4 w-4", isFavorite(product.id) && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={product.inStock ? "default" : "secondary"}>
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </Badge>
          </div>
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={cn("w-2 h-2 rounded-full", index === currentImageIndex ? "bg-white" : "bg-white/50")}
                  onClick={(e) => handleImageNavigation(e, index)}
                />
              ))}
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="min-h-[3rem]">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{product.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className={cn("text-sm font-medium", getRatingColor(product.rating))}>{product.rating}</span>
            {userCommentsCount > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {userCommentsCount}
              </span>
            )}
          </div>
          <div className="text-xl font-bold mb-4">{product.price.toLocaleString()} ₽</div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
          <Button variant={isInComparison ? "default" : "outline"} className="flex-1" onClick={handleComparisonToggle}>
            <Compare className="h-4 w-4 mr-2" />
            {isInComparison ? "Убрать" : "Сравнить"}
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              setDialogImageIndex(currentImageIndex)
              setIsDialogOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <ProductDetailsDialog />
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
