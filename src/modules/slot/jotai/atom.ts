import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Slot } from '../lib/types';
import { RemainModalProps, ReplaceModalProps } from './types';

export const slotAtom = atom<Slot[]>([]);

// slot
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

export const replaceModalAtom = atom<ReplaceModalProps>({
  open: false,
  onClick: () => {},
  product: undefined
});
export const remainModalAtom = atom<RemainModalProps>({
  open: false,
  onClick: () => {},
  product: undefined
});
