"use client"

import { useState } from "react"
import { useComparison } from "@/hooks/use-comparison"
import { useComparisonActions } from "@/hooks/use-comparison-actions"
import { ComparisonTable } from "@/components/comparison-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Download, ChevronDown, FileJson, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

export default function ComparisonPage() {
  return (
    <ProtectedRoute>
      <ComparisonPageContent />
    </ProtectedRoute>
  )
}

function ComparisonPageContent() {
  const { comparisonItems, removeFromComparison, clearComparison, isLoaded } = useComparison()
  const { exportComparison, isExporting } = useComparisonActions()
  const [hideIdentical, setHideIdentical] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка сравнения...</p>
        </div>
      </div>
    )
  }

  if (comparisonItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Нет товаров для сравнения</h1>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            Добавьте товары из каталога для сравнения их характеристик
          </p>
          <Link href="/">
            <Button>Перейти к каталогу</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleExport = (format: "json" | "csv") => {
    exportComparison(comparisonItems, format)
  }

  return (
    <div className={`min-h-screen bg-background ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Назад к каталогу</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
              </Link>
              <h1 className="text-lg md:text-2xl font-bold">Сравнение товаров ({comparisonItems.length})</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <Switch id="hide-identical" checked={hideIdentical} onCheckedChange={setHideIdentical} />
                <Label htmlFor="hide-identical" className="text-xs md:text-sm">
                  Скрыть одинаковые
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFullscreen(!fullscreen)} className="hidden md:flex">
                {fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Экспорт..." : "Экспорт"}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    <FileJson className="h-4 w-4 mr-2" />
                    Экспорт в JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Экспорт в CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="destructive" size="sm" onClick={clearComparison}>
                <span className="hidden sm:inline">Очистить все</span>
                <span className="sm:hidden">Очистить</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <ComparisonTable
          products={comparisonItems}
          hideIdentical={hideIdentical}
          onRemoveProduct={removeFromComparison}
        />
      </main>
    </div>
  )
}
