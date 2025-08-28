'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { replaceModalAtom, selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { Button } from '@/shared/ui/shadcn/button';
import { useAtom } from 'jotai';
import { miniToastAtom } from '@/shared/jotai/atom';
import { useRouter } from 'next/navigation';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { ProductCoinStockHistory } from '@/shared/ui/components/products/ProductCoinStockHistory';
import { dummyGacha } from '@/shared/hooks/dummyData';
import { SlotProduct } from '@/modules/slot/lib';

export const SlotReplaceProduct = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SlotProduct | null>(
    null
  );
  const [replaceModal, setReplaceModal] = useAtom(replaceModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [selectedSlot] = useAtom(selectedSlotAtom);
  const router = useRouter();

  const handleSelect = useCallback(
    (product: SlotProduct) => {
      setSelectedProduct((prev: SlotProduct | null) =>
        prev?.id === product.id ? null : product
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
        router.push(`/display/slot/${selectedSlot?.id}`);
      },
      product: selectedProduct || undefined
    });
  }, [setReplaceModal, setMiniToast, selectedProduct]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="container">
      <Subtitle>재고 상품 목록</Subtitle>

      <ul className="mb-4 flex flex-col gap-2 overflow-y-auto">
        {dummyGacha.map((item, index) => (
          <ProductCoinStockHistory
            key={index}
            index={index}
            product={item}
            isSelected={selectedProduct?.id === item.id}
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
