'use client';

import React, { useCallback, useState } from 'react';
import { ProductCoinStockHistory } from '@/shared/ui/components/products/ProductCoinStockHistory';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { Button } from '@/shared';
import { Camera, Package2, SearchIcon } from 'lucide-react';

const product = {
  image: 'https://via.placeholder.com/150',
  name: 'Product 1',
  stock: 10,
  lastModified: '2021-01-01',
  coin: 100
};

// 동일한 코인만 보여줘야됨.

export const SlotAddProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const handleSelect = useCallback((index: number) => {
    setSelectedProduct((prev: number | null) =>
      prev === index ? null : index
    );
  }, []);

  const handleAddProduct = useCallback(() => {
    console.log('add product');
  }, []);

  return (
    <section className="container flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-3 rounded-md bg-gray-200 p-3 pl-4">
          <SearchIcon size={18} />
          <input
            placeholder="검색어를 입력하세요."
            className="placeholder:text-ts-sm w-full border-transparent bg-transparent text-sm shadow-none ring-0 outline-none active:ring-0"
          />
        </div>
        <div className="flex h-full cursor-pointer items-center justify-center rounded-md p-2 hover:bg-gray-200">
          <Camera size={20} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Subtitle>
          <Package2 size={18} /> 재고 상품 목록
        </Subtitle>
        <ul className="mb-4 flex flex-col gap-2 overflow-y-auto">
          {Array.from({ length: 5 }).map((_, index) => (
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
              onClick={handleAddProduct}
            >
              상품 등록하기
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
