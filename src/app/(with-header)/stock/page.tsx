'use client';
import { dummyGacha } from '@/shared/hooks/dummyData';
import { Button } from '@/shared/ui/appbar/button';
import { ChevronDown, Copyright, Plus } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/shadcn';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { selectedStockProductAtom } from '@/modules/product/jotai/atom';
import { ProductAddButton } from '@/shared/ui/components/buttons/ProductAddButton';
const page = () => {
  const router = useRouter();
  const stockList = useMemo(() => {
    return dummyGacha;
  }, []);
  const [selectedStock, setSelectedStock] = useAtom(selectedStockProductAtom);
  const handleOnclick = (id: string) => {
    setSelectedStock(stockList.find((item) => item.id === id) || null);
    router.push(`/stock/${id}`);
  };

  return (
    <section className="container mb-20 flex h-screen flex-col overscroll-y-none">
      <div className="flex flex-col">
        <div className="text-black-60 mt-2 flex gap-2 py-4">
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="이름순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="createdAt">등록순</SelectItem>
              <SelectItem value="price">가격</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="가격" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3코인</SelectItem>
              <SelectItem value="4">4코인</SelectItem>
              <SelectItem value="5">5코인</SelectItem>
              <SelectItem value="6">6코인</SelectItem>
              <SelectItem value="7">7코인</SelectItem>
              <SelectItem value="8">8코인</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {stockList.length > 0 ? (
          <ul className="mb-20 grid grid-cols-2 gap-4">
            {stockList.map((item) => (
              <li
                key={item.id}
                className="flex cursor-pointer flex-col items-center gap-2"
                onClick={() => handleOnclick(item.id)}
              >
                <div className="flex aspect-square w-full overflow-hidden rounded-md border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex w-full items-center justify-between px-2">
                  <div className="flex flex-col items-start">
                    <p>{item.name}</p>
                    <div className="text-black-60 flex items-center justify-start gap-1 text-sm">
                      <Copyright size={14} /> {item.price}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: item.quantity }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-black-60 h-2 w-2 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-[500px] items-center justify-center">
            <div>재고 상품이 없습니다.</div>
          </div>
        )}
        <ProductAddButton onClick={() => router.push('/stock/add')} />
      </div>
    </section>
  );
};

export default page;
