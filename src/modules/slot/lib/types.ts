import { LAYER_NAMES } from './constants';

export type Layer = (typeof LAYER_NAMES)[number];
export type MapSize = { rows: number; cols: number };
export type SelectedCell = { row: number; col: number } | null;

export interface ParentLocation {
  id: string; // 부모 위치 ID (예: 2-3)
  row: number;
  col: number;
  name?: string; // 위치 이름 (선택사항)
}

export interface Slot {
  id: string; // 위치 고유 ID (부모ID-1, 부모ID-2, 부모ID-3) -> (예: 2-3-1, 2-3-2)
  parentId: string; // 부모 위치 ID
  row: number;
  col: number;
  layer: 'top' | 'middle' | 'bottom';
  price: number; // 위치 가격
  maxQuantity: number;
  currentQuantity: number;
  status: 'active' | 'inactive' | 'maintenance';
  product?: Product;
  lastModified?: Date;
  inStockDate?: Date;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  description?: string;
  inStockDate?: Date;
  lastModified?: Date;
  brand?: string;
  tags?: string[];
  category?: string;
}

export interface ParentLocation {
  id: string; // 부모 위치 ID (예: 2-3)
  row: number;
  col: number;
  name?: string; // 위치 이름 (선택사항)
}

export interface SuggestedLocation extends Slot {
  reason: 'empty' | 'old_stock' | 'price_match';
  parentName?: string;
}

export interface ProductModifyFormProps {
  location: Slot;
  availableProducts: Product[];
  onComplete: (updatedLocation?: Slot) => void; // 업데이트된 Slot 객체를 반환하도록 변경
  onCancel: () => void; // 취소 버튼을 위한 onCancel 추가
}

export interface ProductRegisterFormProps {
  location: Slot;
  availableProducts: Product[];
  onComplete: (updatedLocation: Slot, isNew: boolean) => void; // updatedLocation을 반환하도록 변경
  onCancel: () => void; // 취소 버튼을 위한 onCancel 추가
  isNew: boolean; // 새로운 위치인지 여부를 나타내는 prop 추가
}

export interface EditLocationProps {
  location: Slot;
  onSave: (updatedLocation: Slot) => void;
  onCancel: () => void;
  onDelete: (locationId: string) => void;
  availableProducts: Product[];
}
