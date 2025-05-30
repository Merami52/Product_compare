"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ContrastIcon as Compare } from "lucide-react"
import type { Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"

interface ComparisonPanelProps {
  items: Product[]
  onRemoveItem: (id: string) => void
}

export function ComparisonPanel({ items, onRemoveItem }: ComparisonPanelProps) {
  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card className="shadow-lg">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Compare className="h-4 md:h-5 w-4 md:w-5" />
              <span className="font-semibold text-sm md:text-base">Сравнение товаров</span>
              <Badge variant="secondary" className="text-xs">
                {items.length}
              </Badge>
            </div>
            <Link href="/comparison">
              <Button size="sm" className="text-xs md:text-sm">
                <span className="hidden sm:inline">Перейти к сравнению</span>
                <span className="sm:hidden">Сравнить</span>
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
            {items.map((item) => (
              <div key={item.id} className="relative flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-lg overflow-hidden border">
                  <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-5 w-5 md:h-6 md:w-6 p-0 rounded-full"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <X className="h-2 w-2 md:h-3 md:w-3" />
                </Button>
                <p className="text-xs mt-1 text-center max-w-16 md:max-w-20 truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
