"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AddProductForm } from "@/components/admin/add-product-form"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Users, BarChart3, Settings } from "lucide-react"
import type { Product } from "@/types/product"

export default function AdminPage() {
  const { products, categories, brands } = useProducts()
  const [newProducts, setNewProducts] = useState<Product[]>([])

  const handleProductAdded = (product: Product) => {
    setNewProducts((prev) => [product, ...prev])
  }

  const totalProducts = products.length + newProducts.length
  const totalCategories = categories.length
  const totalBrands = brands.length

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Админ панель</h1>
                <p className="text-muted-foreground">Управление товарами и системой</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {newProducts.length > 0 && `+${newProducts.length} новых`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Категории</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">Активных категорий</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Бренды</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBrands}</div>
                <p className="text-xs text-muted-foreground">Партнерских брендов</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="add-product" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="add-product">Добавить товар</TabsTrigger>
              <TabsTrigger value="products">Товары</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="add-product">
              <AddProductForm onProductAdded={handleProductAdded} categories={categories} brands={brands} />
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Управление товарами</CardTitle>
                  <CardDescription>Просмотр и редактирование товаров</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newProducts.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Недавно добавленные товары</h3>
                        <div className="space-y-2">
                          {newProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {product.brand} • {product.category} • {product.price.toLocaleString()} ₽
                                </p>
                              </div>
                              <Badge variant={product.inStock ? "default" : "secondary"}>
                                {product.inStock ? "В наличии" : "Нет в наличии"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Существующие товары</h3>
                      <p className="text-muted-foreground">Всего товаров в каталоге: {products.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика</CardTitle>
                  <CardDescription>Статистика и отчеты</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Аналитика в разработке</h3>
                    <p className="text-muted-foreground">
                      Здесь будут отображаться графики продаж, популярные товары и другая статистика
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки системы</CardTitle>
                  <CardDescription>Конфигурация и параметры</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Настройки в разработке</h3>
                    <p className="text-muted-foreground">
                      Здесь будут настройки категорий, брендов, пользователей и системы
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
