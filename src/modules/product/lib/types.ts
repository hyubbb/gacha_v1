import { Slot } from "@/modules/slot/lib"

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
  status?: 'registered' | 'in_stock' | 'displayed',
  createdAt?: Date
}
 
export interface ProductSearchProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export interface ProductRegistrationProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export interface ListProps {   
  sortedProducts: Product[]
  onEditProduct: (product: Product) => void
  onViewLocations: (product: Product) => void
  onDeleteProduct: (productId: string) => void
}

export interface TotalProps {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalValue: number
}

export interface FilterProps {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  resetFilters: () => void
  categoryFilter: string
  setCategoryFilter: (categoryFilter: string) => void
  statusFilter: string
  setStatusFilter: (statusFilter: string) => void
  priceRange: { min: string; max: string }
  setPriceRange: (priceRange: { min: string; max: string }) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
  sortOrder: string
  setSortOrder: (sortOrder: string) => void
  categories: string[]
}

export interface EditProductModalProps {
  isEditModalOpen: boolean
  setIsEditModalOpen: (isOpen: boolean) => void
  editingProduct: Product | null
  setEditingProduct: (product: Product) => void
  onSaveProduct: () => void
}

export interface LocationModalProps {
  isLocationModalOpen: boolean
  setIsLocationModalOpen: (isOpen: boolean) => void
  selectedProduct: Product | null
  getProductLocations: (productId: string) => Slot[]
}