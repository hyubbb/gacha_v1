import { cn } from '@/shared';

export function Dummy({ className }: { className?: string }) {
  return <div className={cn('size-[32px]', className)} />;
}
