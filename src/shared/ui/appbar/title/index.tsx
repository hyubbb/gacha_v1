import { cn } from '@/shared';

export function Title({
  title,
  className
}: {
  title: string | React.ReactNode;
  className?: string;
}) {
  return <p className={cn('text-ts-md', className)}>{title}</p>;
}
