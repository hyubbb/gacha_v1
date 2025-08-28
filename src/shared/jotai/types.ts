export type CoinModifyModalProps = {
  title: string;
  description?: string;
  open: boolean;
  coin?: number;
  onSubmit?: (draftCoin: number) => void;
};
export type ProductDetailModalProps = {
  open: boolean;
};

export type ErrorHistoryModalProps = {
  open: boolean;
};
export type MiniToastProps = {
  open: boolean;
  message: string;
  isButton?: boolean;
  buttonText?: string;
  time?: number;
  position?: 'top' | 'bottom';
  onClose?: () => void;
};
