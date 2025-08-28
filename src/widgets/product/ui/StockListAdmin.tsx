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
import { Product } from '@/modules/slot/lib';
import { Package2 } from 'lucide-react';

export const StockListAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [replaceModal, setReplaceModal] = useAtom(replaceModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [selectedSlot] = useAtom(selectedSlotAtom);
  const router = useRouter();

  const handleSelect = useCallback(
    (product: Product) => {
      setSelectedProduct((prev: Product | null) =>
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
      <Subtitle>
        <Package2 size={18} /> 재고 상품 목록
      </Subtitle>
      <div className="mb-24 h-full">
        <ul className="mb-4 flex max-h-full flex-col gap-2 overflow-y-auto">
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
      </div>
      <div className="fixed bottom-8 left-0 z-10 flex w-full justify-center gap-2">
        <div className="flex w-[90%] gap-4">
          {/* todo: 기존항목에 합산을 하게 되는것이
            지금 이화면은 상품을 추가할려했는데 빈칸이 없어서 오게 된것인데 이 상황에서 기존항목에 합산하는 경우가 있을수있나?
            재고 상품을 
          */}
          <Button
            variant="outline"
            size="xxl"
            className="flex-1"
            disabled={selectedProduct === null}
            onClick={handleReplace}
          >
            기존 항목에 합산
          </Button>
          <Button
            variant="default"
            size="xxl"
            className="flex-1"
            onClick={handleReplace}
          >
            새 항목으로 등록
          </Button>
        </div>
      </div>
    </section>
  );
};
