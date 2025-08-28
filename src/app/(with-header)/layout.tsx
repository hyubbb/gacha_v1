'use client';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/shared/styles/globals.css';
import { Header } from '@/modules/layout/components';
import { usePathname } from 'next/navigation';
import { Appbar } from '@/shared/ui/appbar';

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const pathname = usePathname();

  if (
    pathname.endsWith(`/stock/${pathname.split('/')[2]}`) ||
    pathname.endsWith(`/stock/add`)
  ) {
    return <>{children}</>;
  }

  if (pathname.endsWith(`/old`) || pathname.endsWith(`/slot`)) {
    return (
      <>
        <Appbar>
          <Appbar.Center title="판매 상품 등록" />
          <Appbar.BackButton text="뒤로" />
        </Appbar>
        {children}
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
