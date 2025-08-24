import { Slot } from '@/shared/lib'
import { STALE_INVENTORY_DAYS, LOW_STOCK_THRESHOLD } from './constants'

export const getLayerColor = (location: Slot | undefined): string => {
  if (!location) return 'bg-gray-100 border-gray-200 border-[1px]'

  if (location.product && location.product.inStockDate) {
    const sevenDaysAgo = new Date(Date.now() - STALE_INVENTORY_DAYS * 24 * 60 * 60 * 1000)
    if (location.product.inStockDate < sevenDaysAgo) {
      return 'bg-yellow-100 border-yellow-300'
    }
  }

  switch (location.status) {
    case 'active':
      if (location.product) {
        if (location.currentQuantity === 0) return 'bg-red-100 border-red-300'
        if (location.currentQuantity < location.maxQuantity * LOW_STOCK_THRESHOLD) return 'bg-orange-100 border-orange-300'
        return 'bg-green-100 border-green-300'
      }
      return 'bg-blue-100 border-blue-300'
    case 'inactive':
      return 'bg-gray-200 border-gray-400'
    case 'maintenance':
      return 'bg-purple-100 border-purple-300'
    default:
      return 'bg-gray-100 border-gray-200'
  }
}

export const hasPriceMismatch = (location: Slot | undefined): boolean => {
  return !!(location?.product && location.price !== location.product.price)
}

export const clampInt = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))


export const getStoreDisplayName = (storeId: string): string => {
  const storeNames: Record<string, string> = {
    'store-001': '강남점',
    'store-002': '홍대점',
    'store-003': '명동점'
  }
  return storeNames[storeId] || storeId
}
