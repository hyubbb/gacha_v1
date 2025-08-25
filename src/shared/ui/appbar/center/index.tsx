import { cn } from '@/shared';

export function Center({
  title,
  className
}: {
  title: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className="absolute top-0 left-0 z-0 my-2 flex h-[48px] w-full flex-1 items-center justify-center">
      <p className={cn('text-ts-md', className)}>{title}</p>
    </div>
  );
}
