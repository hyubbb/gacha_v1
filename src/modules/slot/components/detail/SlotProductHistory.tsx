import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { History } from 'lucide-react';
import React from 'react';

export const SlotProductHistory = ({ product }: { product: any }) => {
  return (
    <section className="flex flex-col gap-3">
      <Subtitle>
        <History className="h-4 w-4" /> 히스토리
      </Subtitle>
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-1">
        <div className="flex gap-2 rounded-md p-2 pt-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={product?.image}
              alt={product?.name}
              className="aspect-square h-26 w-auto rounded bg-amber-300 object-contain"
            />
          </div>
          <div className="flex w-2/3 flex-col gap-2 p-px">
            <div className="text-xs text-gray-500">2025-08-16 10:00:00</div>
            <div className="text-sm font-semibold text-zinc-800">
              상품교체/수량변경
            </div>
            <div className="text-xs text-gray-500">
              체인소맨-캡슐 피규어 컬렉션
            </div>
          </div>
        </div>
        <div className="flex gap-2 rounded-md p-2 pt-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={product?.image}
              alt={product?.name}
              className="aspect-square h-26 w-auto rounded bg-amber-300 object-contain"
            />
          </div>
          <div className="flex w-2/3 flex-col gap-2 p-px">
            <div className="text-xs text-gray-500">2025-08-16 10:00:00</div>
            <div className="text-sm font-semibold text-zinc-800">
              상품교체/수량변경
            </div>
            <div className="text-xs text-gray-500">
              체인소맨-캡슐 피규어 컬렉션
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
