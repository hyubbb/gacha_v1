'use client';

import '@/shared/styles/globals.css';
import { Appbar } from '@/shared/ui/appbar';
import { usePathname, useRouter } from 'next/navigation';

export default function DisplayListLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  console.log(pathname);

  // /detail 이하에서는 layout 미적용
  if (pathname.endsWith('/change') || pathname.endsWith('/add')) {
    return <>{children}</>;
  }
  return (
    <>
      <Appbar>
        <Appbar.BackButton text="뒤로" />
      </Appbar>
      {children}
    </>
  );
}
