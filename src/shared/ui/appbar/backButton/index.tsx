import { cn } from '@/shared';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function BackButton({
  className,
  onClick,
  text
}: {
  className?: string;
  onClick?: () => void;
  text?: string;
}) {
  const router = useRouter();

  const handleClick = useCallback((): void => {
    if (onClick) {
      onClick();
      return;
    }
    router.back();
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'z-1 flex min-w-[32px] items-center justify-center gap-1', // gap으로 여백도 추가
        className
      )}
    >
      <ChevronLeft className="relative top-[-1px] size-6" />
      {text && <span className="text-ts-md">{text}</span>}
    </button>
  );
}
