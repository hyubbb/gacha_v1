import type React from 'react';

export type SideButtonProps = {
  onClick: () => void;
  startIcon?: React.ReactNode;
  title?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
