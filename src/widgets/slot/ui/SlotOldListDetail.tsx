'use client';
import { selectedStockProductAtom } from '@/modules/product/jotai/atom';
import { ProductHistory } from '@/modules/slot/components/detail/SlotProductHistory';
import { dummyGacha } from '@/shared/hooks/dummyData';
import { coinModifyModalAtom } from '@/shared/jotai/atom';
import { ProductQuantityDot } from '@/shared/ui/components/products/ProductQuantityDot';
import { Button } from '@/shared/ui/shadcn';
import { useAtom, useSetAtom } from 'jotai';
import { Copyright, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

export const SlotOldListDetail = () => {
  const [selectedStock, setSelectedStock] = useAtom(selectedStockProductAtom);
  const [coinModifyModal, setCoinModifyModal] = useAtom(coinModifyModalAtom);
  const router = useRouter();
  const handleCoinModifyModalOpen = useCallback(() => {
    setCoinModifyModal({
      title: '슬롯 코인 변경',
      description: '변경하고자 하는 코인 수를 입력하세요.',
      open: true
      // coin: selectedStock?.price || 0,
      // onSubmit: (draftCoin: number) => {
      //   setSelectedStock({ ...selectedStock, price: draftCoin } as Product);
      // }
    });
  }, [selectedStock, setSelectedStock, setCoinModifyModal]);

  const handleSellProductRegister = useCallback(() => {
    setSelectedStock(selectedStock);
    router.push('/display?status=add');
  }, []);

  return (
    <section className="container flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="border-primary-500 aspect-square overflow-hidden rounded-lg border-1">
          <img
            src={selectedStock?.image}
            alt={selectedStock?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 px-2">
          <div className="text-dark-100 text-2xl font-semibold">
            {selectedStock?.name}
          </div>
          <div className="text-dark-60 text-sm">
            {selectedStock?.description}
          </div>
          <div className="text-dark-60 flex items-center gap-2 text-sm">
            코인
            <div className="h-4 w-[0.5px] rounded-full bg-gray-400" />
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1 text-black">
                <Copyright size={14} /> {selectedStock?.price}
              </div>
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={handleCoinModifyModalOpen}
              >
                <Pencil className="h-3 w-3" /> 코인 변경
              </div>
            </div>
          </div>
          <div className="text-dark-60 flex items-center gap-2 text-sm">
            재고
            <div className="h-4 w-[0.5px] rounded-full bg-gray-400" />
            <ProductQuantityDot quantity={selectedStock?.quantity} />
          </div>
        </div>
      </div>
      <ProductHistory product={dummyGacha[0]} />
      <div className="fixed bottom-10 left-0 flex w-full justify-center">
        <Button
          variant="default"
          size={'lg'}
          className="w-[90%] max-w-[400px]"
          onClick={handleSellProductRegister}
        >
          판매 상품으로 등록
        </Button>
      </div>
    </section>
  );
};
