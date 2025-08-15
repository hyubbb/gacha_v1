export interface ParentLocation {
  id: string // 부모 위치 ID (예: 2-3)
  row: number
  col: number
  name?: string // 위치 이름 (선택사항)
}

export interface Slot {
  id: string // 위치 고유 ID (부모ID-1, 부모ID-2, 부모ID-3) -> (예: 2-3-1, 2-3-2)
  parentId: string // 부모 위치 ID
  row: number
  col: number
  layer: 'top' | 'middle' | 'bottom'
  price: number // 위치 가격
  maxQuantity: number
  currentQuantity: number
  status: 'active' | 'inactive' | 'maintenance'
  product?: {
    id: string
    name: string
    image: string
    price: number // 할당된 상품의 가격
    inStockDate?: Date // 상품이 이 위치에 입고된 날짜
  }
}

export interface SuggestedLocation extends Slot {
  reason: 'empty' | 'old_stock' | 'price_match';
  parentName?: string;
}
