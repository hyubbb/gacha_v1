import { Product } from '../lib';

type Action = 'random' | 'stock' | 'delete';

export type ReplaceModalProps = {
  open: boolean;
  onClick: (type: Action) => void;
  product: Product | undefined;
};

export type RemainModalProps = {
  open: boolean;
  onClick: (type: Action) => void;
  product: Product | undefined;
};

export type CoinNotSlotModalProps = {
  open: boolean;
  onClick?: (type: Action) => void;
  product?: Product;
};
