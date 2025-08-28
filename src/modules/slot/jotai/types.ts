import { SlotProduct } from '../lib';

type Action = 'random' | 'stock' | 'delete';

export type ReplaceModalProps = {
  open: boolean;
  onClick: (type: Action) => void;
  product: SlotProduct | undefined;
};

export type RemainModalProps = {
  open: boolean;
  onClick: (type: Action) => void;
  product: SlotProduct | undefined;
};

export type CoinNotSlotModalProps = {
  open: boolean;
  onClick?: (type: Action) => void;
  product?: SlotProduct;
};
