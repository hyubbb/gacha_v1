import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Slot } from '../lib/types';
import { RemainModalProps, ReplaceModalProps } from './types';

export const slotAtom = atom<Slot[]>([]);

// slot
export const selectedSlotAtom = atomWithStorage<Slot | null>(
  'selectedSlot',
  null
);

export const replaceModalAtom = atom<ReplaceModalProps>({
  open: false,
  onClick: () => {}
});
export const remainModalAtom = atom<RemainModalProps>({
  open: false,
  onClick: () => {}
});
