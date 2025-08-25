'use client';
import { Camera, SearchIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { SlotProduct } from '@/modules/slot/lib';

export const ProductSearch = ({
  products,
  searchTerm,
  setSearchTerm
}: {
  products: SlotProduct[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  // todo: 디바운스 처리 해줄것

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <section className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-3 rounded-md bg-gray-200 p-3 pl-4">
        <SearchIcon size={18} />
        <input
          placeholder="검색어를 입력하세요."
          className="placeholder:text-ts-sm w-full border-transparent bg-transparent text-sm shadow-none ring-0 outline-none active:ring-0"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="flex h-full cursor-pointer items-center justify-center rounded-md p-2 hover:bg-gray-200">
        <Camera size={20} />
      </div>
    </section>
  );
};
