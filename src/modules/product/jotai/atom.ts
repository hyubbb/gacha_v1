import { atom } from 'jotai';
import { SlotProduct } from '@/modules/slot/lib';

// 상품 검색 후에 선택한 상품을 저장하는 atom
export const selectedStockProductAtom = atom<SlotProduct | null>(null);
