"use client"

import { useState } from "react"
import type { Product } from "@/types/product"

export function useComparisonActions() {
  const [isExporting, setIsExporting] = useState(false)

  const exportComparison = (products: Product[], format: "json" | "csv" = "json") => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `comparison-${timestamp}.${format}`

      if (format === "json") {
        const exportData = {
          metadata: {
            exportDate: new Date().toISOString(),
            productsCount: products.length,
            source: "ProductCompare",
          },
          products: products.map((product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            rating: product.rating,
            reviewCount: product.reviewCount,
            inStock: product.inStock,
            description: product.description,
            specifications: product.specifications,
          })),
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        })
        downloadFile(blob, filename)
      } else if (format === "csv") {
        // Get all unique specification keys
        const allSpecs = new Set<string>()
        products.forEach((product) => {
          Object.keys(product.specifications).forEach((spec) => allSpecs.add(spec))
        })

        // Create CSV headers
        const headers = [
          "Название",
          "Бренд",
          "Категория",
          "Цена (₽)",
          "Рейтинг",
          "Количество отзывов",
          "В наличии",
          "Описание",
          ...Array.from(allSpecs),
        ]

        // Create CSV rows
        const rows = products.map((product) => [
          `"${product.name.replace(/"/g, '""')}"`,
          `"${product.brand.replace(/"/g, '""')}"`,
          `"${product.category.replace(/"/g, '""')}"`,
          product.price,
          product.rating,
          product.reviewCount,
          product.inStock ? "Да" : "Нет",
          `"${product.description.replace(/"/g, '""')}"`,
          ...Array.from(allSpecs).map((spec) => `"${(product.specifications[spec] || "").replace(/"/g, '""')}"`),
        ])

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

        // Add BOM for proper UTF-8 encoding in Excel
        const BOM = "\uFEFF"
        const blob = new Blob([BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        })
        downloadFile(blob, filename)
      }

      showSuccessMessage(`Файл ${filename} успешно загружен!`)
    } catch (error) {
      console.error("Error exporting:", error)
      showErrorMessage("Ошибка при экспорте данных")
    } finally {
      setIsExporting(false)
    }
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const showSuccessMessage = (message: string) => {
    // Create a simple toast-like notification
    const toast = document.createElement("div")
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 400px;
      word-wrap: break-word;
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = "0"
      toast.style.transition = "opacity 0.3s ease"
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 3000)
  }

  const showErrorMessage = (message: string) => {
    // Create a simple toast-like notification for errors
    const toast = document.createElement("div")
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 400px;
      word-wrap: break-word;
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = "0"
      toast.style.transition = "opacity 0.3s ease"
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 4000)
  }

  return {
    exportComparison,
    isExporting,
  }
}
