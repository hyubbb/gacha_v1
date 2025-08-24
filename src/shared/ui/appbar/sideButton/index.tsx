import { cn } from '@/shared';
import type { SideButtonProps } from '@/shared/ui/appbar/sideButton/types';

export function SideButton({
  onClick,
  startIcon,
  title,
  className,
  ...props
}: SideButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group bg-accent-40/10 flex h-[28px] w-fit cursor-pointer flex-row items-center justify-center gap-[4px] rounded-full px-[7px] py-[8px] disabled:cursor-not-allowed',
        startIcon && !title && 'size-[24px] p-[4px]',
        className
      )}
      {...props}
    >
      {startIcon}
      {title && (
        <p className="text-primary-40 text-[12px] font-medium group-disabled:text-[#204635]">
          {title}
        </p>
      )}
    </button>
  );
}
