'use client';
import React, { useMemo, useState } from 'react';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';
import { Copyright, History } from 'lucide-react';
import { ProductSearch } from '@/modules/product/components/search/ProductSearch';
import { dummyGacha } from '@/shared/hooks/dummyData';
import { SlotProduct } from '@/modules/slot/lib';
import { useRouter } from 'next/navigation';
import { selectedStockProductAtom } from '@/modules/product/jotai/atom';
import { useSetAtom } from 'jotai';

// 동일한 코인만 보여줘야됨.

export const ProductAdd = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const setSelectedStockProduct = useSetAtom(selectedStockProductAtom);
  const stockProducts = useMemo(() => {
    return dummyGacha;
  }, []);

  const filteredProducts = useMemo(() => {
    return stockProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockProducts, searchTerm]);

  const handleProductClick = (product: SlotProduct) => {
    setSelectedStockProduct(product);
    router.push(`/display?status=add`);
  };

  return (
    <section className="container flex flex-col gap-5">
      {/* 검색영역 */}
      <ProductSearch
        products={stockProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 최근검색어 */}
      {!searchTerm ? (
        <div className="flex flex-col gap-2">상품을 검색해 주세요.</div>
      ) : (
        // <div className="flex flex-col gap-2">
        //   <Subtitle>
        //     <History size={18} /> 최근검색어
        //   </Subtitle>
        // </div>
        <div className="flex flex-col gap-2">
          <Subtitle>{`'${searchTerm}' 검색결과 (${filteredProducts.length})`}</Subtitle>
          <ul className="grid grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="text-surface-40 flex cursor-pointer flex-col gap-2"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square h-auto w-full rounded-lg border bg-white object-contain"
                />
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm font-semibold">{product.name}</div>
                  <div className="text-dark-60 flex items-center gap-1 text-xs">
                    <Copyright size={12} />
                    {product.price}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
