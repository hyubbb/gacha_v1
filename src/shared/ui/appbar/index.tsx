'use client';

import { cn } from '@/shared';
import { Home } from '@/shared/ui/appbar/home';
import { Logo } from '@/shared/ui/appbar/logo';
import { SideButton } from '@/shared/ui/appbar/sideButton';
import { BackButton } from '@/shared/ui/appbar/backButton';
import { Button } from '@/shared/ui/appbar/button';
import { Dummy } from '@/shared/ui/appbar/dummy';
import { Title } from '@/shared/ui/appbar/title';
import { Center } from './center';

export function Appbar({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'lg:h-appbar-size-lg z-40 mt-2 flex h-[48px] w-full items-center justify-between px-[18px] py-[8px]',
        className
      )}
    >
      {children}
    </header>
  );
}

Appbar.Logo = Logo;
Appbar.Home = Home;
Appbar.Title = Title;
Appbar.BackButton = BackButton;
Appbar.SideButton = SideButton;
Appbar.Button = Button;
Appbar.Dummy = Dummy;
Appbar.Center = Center;
