export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  reviewCount: number
  inStock: boolean
  description: string
  images: string[]
  specifications: Record<string, string>
}
