import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/shared/styles/globals.css';
import { Header } from '@/modules/layout/components';

export const metadata: Metadata = {
  title: '상품 전시 관리 시스템',
  description: '가챠머신 상품 전시 관리 대시보드',
  generator: 'Next.js'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
