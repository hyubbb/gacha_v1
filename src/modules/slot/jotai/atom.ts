import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ParentLocation, Slot } from '../lib/types';
import {
  CoinNotSlotModalProps,
  RemainModalProps,
  ReplaceModalProps
} from './types';

// slot
export const slotAtom = atom<Slot[]>([]);

export const slotListAtom = atomWithStorage<ParentLocation[]>('slotList', []);
export const slotLocationAtom = atomWithStorage<Slot[]>('slotLocation', []);

export const selectedSlotAtom = atomWithStorage<Slot>(
  'selectedSlot',
  {
    id: '',
    parentId: '',
    row: 0,
    col: 0,
    layer: 'top',
    price: 0,
    maxQuantity: 0,
    currentQuantity: 0,
    status: 'active',
    product: undefined,
    inStockDate: undefined
  },
  undefined
);

// 상품 교체
export const replaceModalAtom = atom<ReplaceModalProps>({
  open: false,
  onClick: () => {},
  product: undefined
});

// 재고 처리
export const remainModalAtom = atom<RemainModalProps>({
  open: false,
  onClick: () => {},
  product: undefined
});

// 코인에 맞는 빈 슬롯이 없을 경우의 모달
export const coinNotSlotModalAtom = atom<CoinNotSlotModalProps>({
  open: false,
  onClick: () => {},
  product: undefined
});
