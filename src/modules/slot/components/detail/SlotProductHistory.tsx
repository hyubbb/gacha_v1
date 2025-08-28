import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { History } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { SlotProduct } from '@/modules/slot/lib';
import { dummyGacha } from '@/shared/hooks/dummyData';

export const SlotProductHistory = ({ product }: { product?: SlotProduct }) => {
  const dummyData = dummyGacha;
  const [localeDate, setLocaleDate] = useState<string>('');

  useEffect(() => {
    if (product?.inStockDate) {
      setLocaleDate(product.inStockDate.toLocaleString());
    }
  }, [product?.inStockDate]);

  return (
    <section className="flex flex-col gap-3">
      <Subtitle>
        <History className="h-4 w-4" /> 히스토리
      </Subtitle>
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-1">
        {dummyData.map((item) => (
          <div key={item.id} className="flex gap-2 rounded-md p-2 pt-2">
            <div className="overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="aspect-square h-26 w-auto rounded bg-white object-contain"
              />
            </div>
            <div className="flex w-2/3 flex-col gap-2 p-px">
              <div className="text-xs text-gray-500">{localeDate}</div>
              <div className="text-sm font-semibold text-zinc-800">
                상품교체/수량변경
              </div>
              <div className="text-xs text-gray-500">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
