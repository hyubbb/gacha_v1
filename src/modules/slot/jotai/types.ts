export type ReplaceModalProps = {
  open: boolean;
  onClick: (type: 'random' | 'stock' | 'delete') => void;
};

export type RemainModalProps = {
  open: boolean;
  onClick: (type: 'random' | 'stock') => void;
};
