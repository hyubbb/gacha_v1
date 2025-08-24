import type { HtmlHTMLAttributes } from 'react';

export interface AppBarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
