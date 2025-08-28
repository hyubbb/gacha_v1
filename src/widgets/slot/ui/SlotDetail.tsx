'use client';
import { selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { coinModifyModalAtom } from '@/shared/jotai/atom';
import { Button } from '@/shared';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Copyright, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ModifyButtons } from '@/modules/slot/components/detail/ModifyButtons';
import { ProductInfo } from '@/modules/slot/components/detail/SlotProductInfo';
import { ProductHistory } from '@/modules/slot/components/detail/SlotProductHistory';

export const SlotDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useAtom(selectedSlotAtom);
  const { row, col, product, price } = selectedSlot || {};

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // 커밋된 값(실제 표시/저장용)

  const setCoinModifyModal = useSetAtom(coinModifyModalAtom);
  const handleCoinModifyModalOpen = () => {
    setCoinModifyModal({
      title: '슬롯 코인 변경',
      description: '변경하고자 하는 코인 수를 입력하세요.',
      open: true,
      coin: price,
      onSubmit: (draftCoin: number) => {
        setSelectedSlot({ ...selectedSlot, price: draftCoin });
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="container flex h-full flex-col gap-4 p-2">
      <div className="flex flex-col gap-6 overflow-y-scroll">
        {/* 슬롯 info */}
        <div className="mb-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-zinc-800">
              {row}-{col} 슬롯
            </h1>
            <div className="flex items-center gap-1 rounded-sm bg-black/80 px-2 py-0.5 text-sm text-white">
              랜덤
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Copyright className="h-4 w-4" /> {selectedSlot?.price || 0}개
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={handleCoinModifyModalOpen}
            >
              <Pencil className="h-3 w-3" /> 슬롯 코인 변경
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <ProductInfo product={product} />

        {/* 히스토리 */}
        <ProductHistory product={product} />
      </div>
      {/* 상품 정보 수정 */}
      <ModifyButtons />
    </section>
  );
};
