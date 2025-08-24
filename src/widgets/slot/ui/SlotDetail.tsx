'use client';
import { SlotProductHistory } from '@/modules/slot/components/detail/SlotProductHistory';
import { SlotProductInfo } from '@/modules/slot/components/detail/SlotProductInfo';
import { selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { coinModifyModalAtom } from '@/shared/jotai/atom';
import { Button } from '@/shared';
import { useAtomValue, useSetAtom } from 'jotai';
import { Copyright, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { ModifyButtons } from '@/modules/slot/components/detail/ModifyButtons';

export const SlotDetail = () => {
  const selectedSlot = useAtomValue(selectedSlotAtom);
  const { row, col, product } = selectedSlot || {};

  // 커밋된 값(실제 표시/저장용)
  const [coin, setCoin] = useState(selectedSlot?.price ?? 1);

  const setCoinModifyModal = useSetAtom(coinModifyModalAtom);
  const handleCoinModifyModalOpen = () => {
    setCoinModifyModal({
      title: '슬롯 코인 변경',
      description: '변경하고자 하는 코인 수를 입력하세요.',
      open: true,
      coin: coin,
      onSubmit: (draftCoin: number) => {
        setCoin(draftCoin);
      }
    });
  };

  return (
    <section className="flex h-full flex-col gap-8 p-2 px-4">
      <div className="flex h-full flex-col gap-6">
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
            <Copyright className="h-4 w-4" /> {coin || 1}개
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={handleCoinModifyModalOpen}
            >
              <Pencil className="h-3 w-3" /> 슬롯 코인 변경
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <SlotProductInfo product={product} />

        {/* 히스토리 */}
        <SlotProductHistory product={product} />
      </div>
      {/* 상품 정보 수정 */}
      <ModifyButtons />
    </section>
  );
};
