import type { Product } from '@/modules/product/lib/types';
import { Copyright } from 'lucide-react';
import React from 'react';
import { useAtom } from 'jotai';
import { productDetailModalAtom } from '@/shared/jotai/atom';
import { Subtitle } from '@/shared/ui/components/title/Subtitle';

const ProductDescription = ({ product }: { product: any }) => {
  const [productDetailModal, setProductDetailModal] = useAtom(
    productDetailModalAtom
  );

  const handleProductDetailModalOpen = () => {
    setProductDetailModal({ ...productDetailModal, open: true });
  };
  return (
    <div
      className="flex cursor-pointer gap-2 rounded-md border p-2 pt-2"
      onClick={handleProductDetailModalOpen}
    >
      <div className="">
        <img
          src={product?.image}
          alt={product?.name}
          className="aspect-square h-26 w-auto rounded border-2 bg-amber-300 object-contain"
        />
      </div>
      <div className="flex w-2/3 flex-col gap-4 p-2">
        <div className="text-sm font-semibold text-zinc-800">
          체인소맨-캡슐 피규어 컬렉션
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Copyright className="h-4 w-4" /> 3
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          잔여수량
          <div className="h-[90%] w-[0.5px] rounded-full bg-gray-400" />
          <div className="text-xs text-gray-500">10</div>
        </div>
      </div>
    </div>
  );
};

export const SlotProductInfo = ({ product }: { product: any }) => {
  const handleAddProduct = () => {
    console.log('add product');
  };

  return (
    <section className="flex flex-col gap-3">
      <Subtitle>상품 정보</Subtitle>
      {product ? (
        <ProductDescription product={product} />
      ) : (
        <div
          className="flex h-26 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500"
          onClick={handleAddProduct}
        >
          빈 슬롯
        </div>
      )}
    </section>
  );
};
