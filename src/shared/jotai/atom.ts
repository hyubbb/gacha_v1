import {
  CoinModifyModalProps,
  ErrorHistoryModalProps,
  ProductDetailModalProps
} from '@/shared/jotai/types';
import { atom } from 'jotai';
import { MiniToastProps } from './types';

// modal
export const coinModifyModalAtom = atom<CoinModifyModalProps>({
  title: '',
  description: '',
  open: false,
  coin: 1,
  onSubmit: () => {}
});

export const productDetailModalAtom = atom<ProductDetailModalProps>({
  open: false
});

export const errorHistoryModalAtom = atom<ErrorHistoryModalProps>({
  open: false
});

// toast
export const miniToastAtom = atom<MiniToastProps>({
  open: false,
  message: '',
  isButton: false,
  buttonText: '',
  time: 3000,
  position: 'top',
  onClose: () => {}
});
