"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"
import { ComparisonPanel } from "@/components/comparison-panel"
import { UserMenu } from "@/components/auth/user-menu"
import { useProducts } from "@/hooks/use-products"
import { useComparison } from "@/hooks/use-comparison"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Grid, List, ContrastIcon as Compare } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types"

export default function HomePage() {
  const { products, categories, brands } = useProducts()
  const { comparisonItems, addToComparison, removeFromComparison } = useComparison()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesBrand = !selectedBrand || product.brand === selectedBrand
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange])

  const handleAddToComparison = (product: Product) => {
    if (isAuthenticated) {
      addToComparison(product)
    }
  }

  const handleRemoveFromComparison = (productId: string) => {
    if (isAuthenticated) {
      removeFromComparison(productId)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold">ProductCompare</h1>
            <div className="flex items-center gap-4">
              {isAuthenticated && comparisonItems.length > 0 && (
                <Link href="/comparison">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Compare className="h-4 w-4" />
                    <span className="hidden sm:inline">Сравнить ({comparisonItems.length})</span>
                    <span className="sm:hidden">({comparisonItems.length})</span>
                  </Button>
                </Link>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with filters */}
          <aside className="lg:w-64 space-y-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <ProductFilters
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onBrandChange={setSelectedBrand}
              onPriceRangeChange={setPriceRange}
            />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold">Каталог товаров</h2>
                <p className="text-muted-foreground text-sm md:text-base">Найдено {filteredProducts.length} товаров</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Сетка</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Список</span>
                </Button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  isInComparison={comparisonItems.some((item) => item.id === product.id)}
                  onAddToComparison={() => handleAddToComparison(product)}
                  onRemoveFromComparison={() => handleRemoveFromComparison(product.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {isAuthenticated && comparisonItems.length > 0 && (
        <ComparisonPanel items={comparisonItems} onRemoveItem={removeFromComparison} />
      )}
    </div>
  )
}
