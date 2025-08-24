import type { ButtonProps } from '@/shared/ui/appbar/button/types';

export function Button({
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
