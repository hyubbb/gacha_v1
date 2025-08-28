import { atom } from 'jotai';
import { SlotProduct } from '@/modules/slot/lib';
import { atomWithStorage } from 'jotai/utils';

// 상품 검색 후에 선택한 상품을 저장하는 atom
export const selectedStockProductAtom = atomWithStorage<SlotProduct | null>(
  'selectedStockProduct',
  null
);
