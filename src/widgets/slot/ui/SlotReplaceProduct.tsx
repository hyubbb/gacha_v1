'use client';
import React, { useCallback, useState } from 'react';
import { replaceModalAtom, selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { Button } from '@/shared/ui/shadcn/button';
import { useAtom } from 'jotai';
import { miniToastAtom } from '@/shared/jotai/atom';
import { useRouter } from 'next/navigation';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { ProductCoinStockHistory } from '@/shared/ui/components/products/ProductCoinStockHistory';

export type Product = {
  image: string;
  name: string;
  stock: number;
  lastModified: string;
  coin: number;
};

const product: Product = {
  image: '/images/product/product-1.png',
  name: '체인소맨-캡슐 피규어 컬렉션',
  stock: 3,
  lastModified: '2025-08-16 10:00:00',
  coin: 4
};
export const SlotReplaceProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [replaceModal, setReplaceModal] = useAtom(replaceModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [selectedSlot] = useAtom(selectedSlotAtom);
  const router = useRouter();
  const handleSelect = useCallback(
    (index: number) => {
      console.log(index);

      setSelectedProduct((prev: number | null) =>
        prev === index ? null : index
      );
    },
    [setSelectedProduct]
  );

  const handleReplace = useCallback(() => {
    setReplaceModal({
      open: true,
      onClick: (type: 'random' | 'stock' | 'delete') => {
        setMiniToast({
          open: true,
          message:
            type === 'random'
              ? '랜덤 슬롯으로 이동'
              : type === 'stock'
                ? '재고로 이동'
                : '상품 삭제',
          time: 2000
        });
        router.push(`/display/list/${selectedSlot?.id}`);
      }
    });
  }, [setReplaceModal, setMiniToast]);

  return (
    <section className="container">
      <Subtitle>재고 상품 목록</Subtitle>

      <ul className="mb-4 flex flex-col gap-2 overflow-y-auto">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCoinStockHistory
            key={index}
            index={index}
            product={product}
            isSelected={selectedProduct === index}
            onSelect={handleSelect}
          />
        ))}
      </ul>
      {selectedProduct !== null && (
        <div className="fixed bottom-10 left-0 z-10 flex w-full justify-center">
          <Button
            variant="default"
            className="h-[48px] w-[90%]"
            onClick={handleReplace}
          >
            상품 교체하기
          </Button>
        </div>
      )}
    </section>
  );
};
