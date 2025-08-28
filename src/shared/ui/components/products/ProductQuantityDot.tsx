import React from 'react';

export const ProductQuantityDot = ({ quantity = 0 }: { quantity?: number }) => {
  return (
    <div className="flex items-center gap-1">
      {quantity > 0
        ? Array.from({ length: quantity }, (_, index) => (
            <div key={index} className="h-2 w-2 rounded-full bg-black" />
          ))
        : '재고 없음'}
    </div>
  );
};
