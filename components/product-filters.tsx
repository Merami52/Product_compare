"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductFiltersProps {
  categories: string[]
  brands: string[]
  selectedCategory: string
  selectedBrand: string
  priceRange: number[]
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  onPriceRangeChange: (range: number[]) => void
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const clearFilters = () => {
    onCategoryChange("")
    onBrandChange("")
    onPriceRangeChange([0, 200000])
  }

  const hasActiveFilters = selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 200000

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Фильтры</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Очистить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Категория</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Бренд</Label>
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger>
              <SelectValue placeholder="Все бренды" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все бренды</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>
            Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
          </Label>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={200000}
            min={0}
            step={1000}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
