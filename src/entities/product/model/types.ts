export interface Product {
  id: string
  name: string
  image: string
  price: number // 상품 가격
  quantity: number
  inStockDate?: Date
  brand?: string
  description?: string
  tags?: string[]
  category?: string
  status?: 'registered' | 'in_stock' | 'displayed'
  createdAt?: Date
}
