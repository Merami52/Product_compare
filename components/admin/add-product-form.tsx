"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X, Upload } from "lucide-react"
import type { Product } from "@/types/product"

interface AddProductFormProps {
  onProductAdded?: (product: Product) => void
  categories: string[]
  brands: string[]
}

export function AddProductForm({ onProductAdded, categories, brands }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    inStock: true,
    images: [] as string[],
    specifications: {} as Record<string, string>,
  })

  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.category || !formData.price) {
        throw new Error("Заполните все обязательные поля")
      }

      const price = Number.parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        throw new Error("Введите корректную цену")
      }

      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: price,
        rating: 0,
        reviewCount: 0,
        inStock: formData.inStock,
        description: formData.description,
        images: formData.images.length > 0 ? formData.images : ["/placeholder.svg?height=400&width=400"],
        specifications: formData.specifications,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, you would save to database
      console.log("New product:", newProduct)

      onProductAdded?.(newProduct)
      setSuccess("Товар успешно добавлен!")

      // Reset form
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        description: "",
        inStock: true,
        images: [],
        specifications: {},
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при добавлении товара")
    } finally {
      setIsLoading(false)
    }
  }

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue,
        },
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const addImage = () => {
    if (newImageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl],
      }))
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Добавить новый товар</CardTitle>
        <CardDescription>Заполните информацию о товаре</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="iPhone 15 Pro"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Бренд *</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите бренд" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="89990"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Описание товара..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inStock: checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="inStock">В наличии</Label>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <Label>Изображения</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL изображения"
                disabled={isLoading}
              />
              <Button type="button" onClick={addImage} disabled={!newImageUrl || isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.images.map((url, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    Изображение {index + 1}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <Label>Характеристики</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Название характеристики"
                disabled={isLoading}
              />
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Значение"
                disabled={isLoading}
              />
              <Button type="button" onClick={addSpecification} disabled={!newSpecKey || !newSpecValue || isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>
            {Object.keys(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Добавить товар
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
