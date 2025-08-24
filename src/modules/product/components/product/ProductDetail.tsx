'use client';
import { cn } from '@/shared';
import { Copyright, Printer } from 'lucide-react';
import React, { useState } from 'react';

export const ProductDetail = () => {
  const [edit, setEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: '체인소맨 - 캡슐 피규어 컬렉션',
    description:
      'Lorem ipsum dolor sit amet consectetur. Cras etiam dictum venenatis at elit amet dignissim. Quis',
    image: 'image',
    coin: 100,
    stock: 0
  };

  // 썸네일 변경 핸들러, 추후 이미지 업로드 기능 추가 필요
  const handleImageChange = (index: number) => {
    console.log(index);
    setSelectedImage(index);
  };

  return (
    <section className="flex flex-col gap-6 overflow-hidden rounded-lg">
      <div className="relative w-full overflow-hidden rounded-lg bg-amber-200">
        <div className="aspect-square max-h-[400px] w-full"></div>
        {/* <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-contain"
        /> */}

        {edit ? (
          <div className="absolute right-2 bottom-2 flex gap-2">
            <div className="flex cursor-pointer items-center rounded-3xl bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm">
              썸네일 변경 완료
            </div>
          </div>
        ) : (
          <div className="absolute right-2 bottom-2 flex gap-2">
            <div
              className="flex cursor-pointer items-center rounded-3xl bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm"
              onClick={() => setEdit(true)}
            >
              썸네일 변경
            </div>
            <div className="flex cursor-pointer items-center gap-1 rounded-3xl bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-sm">
              <Printer className="h-4 w-4" />
              썸네일 인쇄
            </div>
          </div>
        )}
      </div>

      {edit && (
        <section className="w-full overflow-x-auto overflow-y-hidden">
          <div className="inline-flex gap-2">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className={cn(
                  'h-20 w-20 shrink-0 cursor-pointer rounded-md border p-2 transition-all duration-300 hover:border-black/40',
                  index === selectedImage && 'border-[1.5px] border-black'
                )}
                onClick={() => handleImageChange(index)}
              >
                {/* <img
                  src={product.image}
                  className="h-full w-full object-contain"
                  alt=""
                /> */}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.description}</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 divide-x divide-gray-300">
            <span className="pr-2 text-gray-500">코인</span>
            <div className="flex items-center gap-1">
              <Copyright className="h-4 w-4" />
              {product.coin}
            </div>
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-2 divide-x divide-gray-300">
              <span className="pr-2 text-gray-500">재고량</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: product.stock }, (_, index) => (
                  <div key={index} className="h-2 w-2 rounded-full bg-black" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
