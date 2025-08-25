'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ProductCoinStockHistory } from '@/shared/ui/components/products/ProductCoinStockHistory';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { Button } from '@/shared';
import { Camera, Package2, SearchIcon } from 'lucide-react';
import { miniToastAtom } from '@/shared/jotai/atom';
import { useAtom } from 'jotai';
import { selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { useRouter } from 'next/navigation';
import { dummyGacha } from '@/shared/hooks/dummyData';
import { SlotProduct } from '@/modules/slot/lib';
import { ProductSearch } from '@/modules/product/components/search/ProductSearch';

// 동일한 코인만 보여줘야됨.

export const SlotAddProduct = () => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<SlotProduct | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] = useAtom(selectedSlotAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [searchTerm, setSearchTerm] = useState('');

  const stockProducts = useMemo(() => {
    return dummyGacha;
  }, []);

  const handleSelect = useCallback((product: SlotProduct) => {
    setSelectedProduct((prev: SlotProduct | null) =>
      prev?.id === product.id ? null : product
    );
  }, []);

  const handleAddProduct = useCallback(() => {
    console.log(selectedSlot, selectedProduct);

    if (!selectedSlot || !selectedProduct) return;

    setSelectedSlot({
      ...selectedSlot,
      inStockDate: new Date(),
      product: selectedProduct
    });

    setMiniToast({
      open: true,
      message: '상품 등록이 완료되었습니다.',
      time: 3000,
      onClose: () => {
        router.push(`/display/slot/${selectedSlot?.id}`);
      }
    });
  }, [selectedSlot, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return stockProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockProducts, searchTerm]);

  return (
    <section className="container flex flex-col gap-6">
      {/* 검색영역 */}
      <ProductSearch
        products={stockProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 재고 상품 목록 */}
      <div className="flex flex-col gap-2">
        <Subtitle>
          <Package2 size={18} /> 재고 상품 목록
        </Subtitle>
        <ul className="mb-4 flex flex-col gap-2 overflow-y-auto">
          {filteredProducts.map((item, index) => (
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
