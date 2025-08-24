import type React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
