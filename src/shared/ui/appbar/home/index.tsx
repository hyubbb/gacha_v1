import { IcHome } from '@/shared/ui/icons/home';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function Home({
  className,
  onClick,
  iconColor
}: {
  className?: string;
  onClick?: () => void;
  iconColor?: string;
}) {
  const router = useRouter();

  const onHomeClick = useCallback(async () => {
    if (onClick) {
      onClick();
      return;
    }
    await router.replace('/');
  }, []);

  return (
    <button type="button" className={className} onClick={onHomeClick}>
      <IcHome width={24} height={24} themeColor={iconColor} />
    </button>
  );
}
