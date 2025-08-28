'use client';

import '@/shared/styles/globals.css';
import { Appbar } from '@/shared/ui/appbar';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DisplayCreateListLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <>
      <Appbar>
        <Appbar.Center title="상품 등록" />
        <Appbar.BackButton text="뒤로" />
      </Appbar>
      {children}
    </>
  );
}
