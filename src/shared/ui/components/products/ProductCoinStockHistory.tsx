import React from 'react';

import { Copyright } from 'lucide-react';
import { Product } from '@/modules/slot/lib';
import { ProductQuantityDot } from './ProductQuantityDot';

export const ProductCoinStockHistory = ({
  product,
  onSelect,
  isSelected,
  index // 상품체크 테스트용코드
}: {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected: boolean;
  index: number;
}) => {
  const localeDate = product?.inStockDate?.toLocaleString() || '';

  return (
    <li
      className={`flex cursor-pointer gap-2 rounded-md p-2 pt-2 text-sm text-gray-500 hover:bg-gray-200 ${
        isSelected ? 'bg-gray-200' : ''
      }`}
      onClick={() => onSelect(product)}
    >
      <div className="overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square h-26 w-auto bg-white object-contain"
        />
      </div>
      <div className="flex w-2/3 flex-col gap-2 p-px">
        <div className="text-sm font-semibold text-zinc-800">
          {product.name}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Copyright className="h-3 w-3" />
          {product.price}개
        </div>

        <div className="flex items-center gap-2 divide-x divide-gray-300 text-xs text-gray-500">
          <div className="pr-2 text-gray-500">재고량</div>
          <ProductQuantityDot quantity={product.quantity} />
        </div>
        <div className="flex items-center gap-2 divide-x divide-gray-300 text-xs text-gray-500">
          <div className="pr-2 text-gray-500">히스토리</div>
          <div className="text-gray-500">{localeDate}</div>
        </div>
      </div>
    </li>
  );
};
