"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, TrendingUp, TrendingDown } from "lucide-react"
import type { Product } from "@/types/product"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ComparisonTableProps {
  products: Product[]
  hideIdentical: boolean
  onRemoveProduct: (id: string) => void
}

// Конфигурация для сравнения характеристик
const COMPARISON_CONFIG = {
  // Характеристики где больше = лучше
  higherIsBetter: [
    "Оперативная память",
    "Встроенная память",
    "Камера",
    "Батарея",
    "Время работы",
    "Быстрая зарядка",
    "Диагональ экрана",
    "Частотный диапазон",
    "Рейтинг",
  ],
  // Характеристики где меньше = лучше
  lowerIsBetter: ["Вес", "Цена"],
  // Специальные правила для извлечения числовых значений
  extractors: {
    memory: /(\d+)\s*(ГБ|GB|ТБ|TB)/i,
    camera: /(\d+)\s*Мп/i,
    battery: /(\d+)\s*мАч/i,
    time: /(\d+)\s*час/i,
    weight: /(\d+)\s*г/i,
    screen: /(\d+\.?\d*)\s*"/i,
    frequency: /(\d+)\s*(Гц|Hz|кГц|kHz)/i,
    charging: /(\d+)\s*мин/i,
    price: /(\d+)/,
  },
}

export function ComparisonTable({ products, hideIdentical, onRemoveProduct }: ComparisonTableProps) {
  const comparisonData = useMemo(() => {
    if (products.length === 0) return []

    const allSpecs = new Set<string>()
    products.forEach((product) => {
      Object.keys(product.specifications).forEach((spec) => allSpecs.add(spec))
    })

    // Функция для извлечения числового значения из строки
    const extractNumericValue = (value: string, specName: string): number | null => {
      if (!value || value === "—") return null

      // Специальные правила для разных типов характеристик
      if (specName.includes("память") || specName.includes("Память")) {
        const match = value.match(COMPARISON_CONFIG.extractors.memory)
        if (match) {
          const num = Number.parseFloat(match[1])
          const unit = match[2].toLowerCase()
          // Конвертируем в ГБ
          return unit.includes("тб") || unit.includes("tb") ? num * 1024 : num
        }
      }

      if (specName.includes("Камера") || specName.includes("камера")) {
        const match = value.match(COMPARISON_CONFIG.extractors.camera)
        return match ? Number.parseFloat(match[1]) : null
      }

      if (specName.includes("Батарея") || specName.includes("батарея")) {
        const match = value.match(COMPARISON_CONFIG.extractors.battery)
        return match ? Number.parseFloat(match[1]) : null
      }

      if (specName.includes("Время") || specName.includes("время")) {
        const match = value.match(COMPARISON_CONFIG.extractors.time)
        return match ? Number.parseFloat(match[1]) : null
      }

      if (specName.includes("Вес") || specName.includes("вес")) {
        const match = value.match(COMPARISON_CONFIG.extractors.weight)
        return match ? Number.parseFloat(match[1]) : null
      }

      if (specName.includes("экрана") || specName.includes("Экрана")) {
        const match = value.match(COMPARISON_CONFIG.extractors.screen)
        return match ? Number.parseFloat(match[1]) : null
      }

      if (specName.includes("Частотный") || specName.includes("частотный")) {
        const match = value.match(COMPARISON_CONFIG.extractors.frequency)
        if (match) {
          const num = Number.parseFloat(match[1])
          const unit = match[2].toLowerCase()
          // Конвертируем в Гц
          return unit.includes("кгц") || unit.includes("khz") ? num * 1000 : num
        }
      }

      if (specName.includes("зарядка") || specName.includes("Зарядка")) {
        const match = value.match(COMPARISON_CONFIG.extractors.charging)
        return match ? Number.parseFloat(match[1]) : null
      }

      // Для рейтинга
      if (specName.includes("Рейтинг") || specName.includes("рейтинг")) {
        const match = value.match(/(\d+\.?\d*)/)
        return match ? Number.parseFloat(match[1]) : null
      }

      // Общий случай - пытаемся извлечь любое число только если характеристика в списке сравнимых
      const isComparable =
        COMPARISON_CONFIG.higherIsBetter.some((spec) => specName.toLowerCase().includes(spec.toLowerCase())) ||
        COMPARISON_CONFIG.lowerIsBetter.some((spec) => specName.toLowerCase().includes(spec.toLowerCase()))

      if (isComparable) {
        const match = value.match(/(\d+\.?\d*)/)
        return match ? Number.parseFloat(match[1]) : null
      }

      return null
    }

    // Функция для определения лучшего значения
    const getBestComparison = (values: string[], specName: string) => {
      // Сначала проверяем, можно ли сравнивать эту характеристику
      const isHigherBetter = COMPARISON_CONFIG.higherIsBetter.some((spec) =>
        specName.toLowerCase().includes(spec.toLowerCase()),
      )
      const isLowerBetter = COMPARISON_CONFIG.lowerIsBetter.some((spec) =>
        specName.toLowerCase().includes(spec.toLowerCase()),
      )

      // Если характеристика не подлежит сравнению, возвращаем neutral для всех
      if (!isHigherBetter && !isLowerBetter) {
        return values.map(() => "neutral")
      }

      const numericValues = values.map((v) => extractNumericValue(v, specName))

      // Если не все значения числовые, не сравниваем
      if (numericValues.some((v) => v === null)) {
        return values.map(() => "neutral")
      }

      const validValues = numericValues as number[]
      const bestValue = isHigherBetter ? Math.max(...validValues) : Math.min(...validValues)
      const worstValue = isHigherBetter ? Math.min(...validValues) : Math.max(...validValues)

      // Если все значения одинаковые, возвращаем neutral для всех
      if (bestValue === worstValue) {
        return values.map(() => "neutral")
      }

      return validValues.map((value) => {
        if (value === bestValue) return "best"
        if (value === worstValue) return "worst"
        return "neutral"
      })
    }

    // Специальная функция для "В наличии"
    const getStockComparison = (values: string[]) => {
      const hasInStock = values.includes("Да")
      const hasOutOfStock = values.includes("Нет")

      // Если все товары в одном состоянии, не показываем индикаторы
      if (!hasInStock || !hasOutOfStock) {
        return values.map(() => "neutral")
      }

      return values.map((value) => (value === "Да" ? "best" : "worst"))
    }

    const rows = [
      {
        label: "Изображение",
        key: "image",
        values: products.map((p) => p.images[0]),
        isDifferent: false,
        comparisons: products.map(() => "neutral" as const),
      },
      {
        label: "Название",
        key: "name",
        values: products.map((p) => p.name),
        isDifferent: new Set(products.map((p) => p.name)).size > 1,
        comparisons: products.map(() => "neutral" as const),
      },
      {
        label: "Бренд",
        key: "brand",
        values: products.map((p) => p.brand),
        isDifferent: new Set(products.map((p) => p.brand)).size > 1,
        comparisons: products.map(() => "neutral" as const),
      },
      {
        label: "Цена",
        key: "price",
        values: products.map((p) => `${p.price.toLocaleString()} ₽`),
        isDifferent: new Set(products.map((p) => p.price)).size > 1,
        comparisons: getBestComparison(
          products.map((p) => p.price.toString()),
          "Цена",
        ),
      },
      {
        label: "Рейтинг",
        key: "rating",
        values: products.map((p) => p.rating),
        isDifferent: new Set(products.map((p) => p.rating)).size > 1,
        comparisons: getBestComparison(
          products.map((p) => p.rating.toString()),
          "Рейтинг",
        ),
      },
      {
        label: "В наличии",
        key: "inStock",
        values: products.map((p) => (p.inStock ? "Да" : "Нет")),
        isDifferent: new Set(products.map((p) => p.inStock)).size > 1,
        comparisons: getStockComparison(products.map((p) => (p.inStock ? "Да" : "Нет"))),
      },
    ]

    // Add specifications
    Array.from(allSpecs).forEach((spec) => {
      const values = products.map((p) => p.specifications[spec] || "—")
      const isDifferent = new Set(values).size > 1
      const comparisons = getBestComparison(values, spec)

      rows.push({
        label: spec,
        key: spec,
        values,
        isDifferent,
        comparisons,
      })
    })

    return hideIdentical ? rows.filter((row) => row.isDifferent || row.key === "image" || row.key === "name") : rows
  }, [products, hideIdentical])

  const getComparisonIcon = (comparison: "best" | "worst" | "neutral") => {
    switch (comparison) {
      case "best":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "worst":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const getComparisonStyle = (comparison: "best" | "worst" | "neutral") => {
    switch (comparison) {
      case "best":
        return "bg-green-50 dark:bg-green-950/20 border-l-2 border-l-green-500"
      case "worst":
        return "bg-red-50 dark:bg-red-950/20 border-l-2 border-l-red-500"
      case "neutral":
      default:
        return ""
    }
  }

  // Адаптивные размеры колонок
  const getColumnWidth = () => {
    if (typeof window === "undefined") return "280px"

    const width = window.innerWidth
    if (width < 640) return "200px" // mobile
    if (width < 1024) return "220px" // tablet
    return "280px" // desktop
  }

  const columnWidth = getColumnWidth()

  return (
    <div className="space-y-6">
      {/* Mobile view - показываем товары вертикально */}
      <div className="block md:hidden">
        <div className="space-y-6">
          {products.map((product, productIndex) => (
            <Card key={product.id} className="relative">
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full z-10"
                onClick={() => onRemoveProduct(product.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <CardHeader className="pb-2">
                <div className="aspect-square relative rounded-lg overflow-hidden max-w-[200px] mx-auto">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <h3 className="font-semibold text-lg mb-1 text-center">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 text-center">{product.brand}</p>
                <div className="text-xl font-bold text-primary text-center mb-4">
                  {product.price.toLocaleString()} ₽
                </div>

                {/* Характеристики для мобильного */}
                <div className="space-y-2">
                  {comparisonData.map((row) => {
                    if (row.key === "image" || row.key === "name" || row.key === "brand") return null

                    const value = row.values[productIndex]
                    const comparison = row.comparisons[productIndex]

                    return (
                      <div
                        key={row.key}
                        className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm font-medium">{row.label}:</span>
                        <div
                          className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded text-sm",
                            getComparisonStyle(comparison),
                          )}
                        >
                          {row.key === "rating" ? (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i < Math.floor(value as number)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300",
                                    )}
                                  />
                                ))}
                              </div>
                              <span>{value}</span>
                              {getComparisonIcon(comparison)}
                            </div>
                          ) : (
                            <>
                              <span>{value}</span>
                              {getComparisonIcon(comparison)}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet view - горизонтальная таблица */}
      <div className="hidden md:block">
        {/* Product headers */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div
              className="grid gap-4 mb-6"
              style={{ gridTemplateColumns: `160px repeat(${products.length}, ${columnWidth})` }}
            >
              <div></div>
              {products.map((product) => (
                <Card key={product.id} className="relative" style={{ width: columnWidth }}>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full z-10"
                    onClick={() => onRemoveProduct(product.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <CardHeader className="pb-2">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                    <div className="text-lg font-bold text-primary">{product.price.toLocaleString()} ₽</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison table */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {comparisonData.map((row, index) => (
                    <div
                      key={row.key}
                      className="grid gap-4 p-4"
                      style={{ gridTemplateColumns: `160px repeat(${products.length}, ${columnWidth})` }}
                    >
                      <div className="font-medium text-sm flex items-center">
                        <span className="line-clamp-2">{row.label}</span>
                        {row.isDifferent && (
                          <Badge variant="outline" className="ml-2 text-xs shrink-0">
                            Различается
                          </Badge>
                        )}
                      </div>
                      {row.values.map((value, productIndex) => (
                        <div
                          key={productIndex}
                          className={cn(
                            "text-sm flex items-center gap-2 p-2 rounded",
                            getComparisonStyle(row.comparisons[productIndex]),
                          )}
                          style={{ width: columnWidth }}
                        >
                          {row.key === "image" ? (
                            <div className="w-16 h-16 relative rounded overflow-hidden mx-auto">
                              <Image
                                src={(value as string) || "/placeholder.svg"}
                                alt="Product"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : row.key === "rating" ? (
                            <div className="flex items-center gap-2 w-full">
                              <div className="flex items-center gap-1 flex-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-3 w-3",
                                        i < Math.floor(value as number)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300",
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs">{value}</span>
                              </div>
                              {getComparisonIcon(row.comparisons[productIndex])}
                            </div>
                          ) : row.key === "inStock" ? (
                            <div className="flex items-center gap-2 w-full">
                              <span className="flex-1 text-xs">{value}</span>
                              {getComparisonIcon(row.comparisons[productIndex])}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 w-full">
                              <span className={cn(row.isDifferent && "font-medium", "flex-1 text-xs line-clamp-2")}>
                                {value}
                              </span>
                              {getComparisonIcon(row.comparisons[productIndex])}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
