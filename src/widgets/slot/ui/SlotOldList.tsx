'use client';
import React, { useEffect, useState } from 'react';
import { selectedSlotAtom, slotLocationAtom } from '@/modules/slot/jotai/atom';
import { Button, Card, Slot } from '@/shared';
import { useAtom } from 'jotai';
import { Copyright, Info } from 'lucide-react';
import { ProductQuantityDot } from '@/shared/ui/components/products/ProductQuantityDot';
import { useRouter } from 'next/navigation';

export const SlotOldList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [slotLocations, setSlotLocations] = useAtom(slotLocationAtom);
  const [selectedSlot, setSelectedSlot] = useAtom(selectedSlotAtom);
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = () => {
    router.push('/display?status=old');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <section className="container flex flex-col gap-6">
      <Card className="text-dark-60 mt-2 flex h-[86px] flex-row items-center px-3 py-2">
        <div className="flex h-full w-16 items-center justify-center">
          <Info className="text-primary" size={24} />
        </div>
        <div className="pr-4">
          <p>
            선택하신 상품의 코인과 동일하며, 히스토리 기록이 가장 오래된 상품을
            보여드려요.
          </p>
        </div>
      </Card>
      {/* 재고 상품 목록 */}
      <div className="flex flex-col gap-2">
        <ul className="mb-4 flex flex-col gap-2 overflow-y-auto">
          {slotLocations.map((item, index) => {
            if (!item.product) return null;
            return (
              <li
                key={item.id}
                className={`flex cursor-pointer gap-2 rounded-md p-2 pt-2 text-sm text-gray-500 hover:bg-gray-200 ${
                  selectedSlot?.id === item.id ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleSelect(item)}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="aspect-square h-26 w-auto bg-white object-contain"
                  />
                </div>
                <div className="flex w-2/3 flex-col gap-2 p-px">
                  <div className="text-sm font-semibold text-zinc-800">
                    {item.product?.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Copyright className="h-3 w-3" />
                    {item.product?.price}개
                  </div>

                  <div className="flex items-center gap-2 divide-x divide-gray-300 text-xs text-gray-500">
                    <div className="pr-2 text-gray-500">슬롯번호</div>
                    <div className="text-gray-500">{item.id}</div>
                  </div>
                  <div className="flex items-center gap-2 divide-x divide-gray-300 text-xs text-gray-500">
                    <div className="pr-2 text-gray-500">히스토리</div>
                    <div className="text-gray-500">
                      {item.product?.inStockDate?.toLocaleString() || ''}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {isSelected !== null && (
          <div className="fixed bottom-10 left-0 z-10 flex w-full justify-center">
            <Button
              variant="default"
              className="h-[48px] w-[90%]"
              onClick={handleSubmit}
            >
              상품 등록하기
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
