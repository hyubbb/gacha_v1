'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { useSetAtom } from 'jotai';
import { dummyGacha } from '@/shared/hooks/dummyData';

const SlotSingle = ({ row, col }: { row: number; col: number }) => {
  const router = useRouter();
  const setSelectedSlot = useSetAtom(selectedSlotAtom);

  const handleClick = (row: number, col: number) => {
    setSelectedSlot({
      row,
      col,
      id: `${row}-${col}`,
      parentId: row + '',
      layer: col === 1 ? 'top' : col === 2 ? 'middle' : 'bottom',
      price: 3,
      maxQuantity: 20,
      currentQuantity: 10,
      status: 'active',
      product: {
        id: '1',
        name: '로보트 가챠',
        image: '/lovot.jpg',
        price: 4,
        quantity: 10,
        inStockDate: new Date()
      }
    });
    const id = `${row}-${col}`;
    router.push(`/display/slot/${id}`);
  };

  return (
    <section
      className="flex h-full flex-col gap-1"
      onClick={() => handleClick(row, col)}
    >
      <div className="ml-6 text-left text-gray-500">
        {row}-{col}
      </div>
      <div className="flex aspect-square h-[90%] w-full items-center justify-center rounded-2xl border-2 p-1.5 transition-all hover:scale-105">
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-200">
          image
        </div>
      </div>
    </section>
  );
};

const SlotPageView = () => {
  const [page, setPage] = useState(1);
  const pageList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const slotContainerRef = useRef<HTMLDivElement>(null);
  // 각 슬롯 “컬럼” DOM을 잡기 위한 refs
  const colRefs = useRef<HTMLDivElement[]>([]);
  colRefs.current = [];

  const setColRef = (el: HTMLDivElement | null) => {
    if (el && !colRefs.current.includes(el)) colRefs.current.push(el);
  };

  // 페이지 클릭 시 해당 컬럼으로 스냅 이동
  const handlePageChange = (p: number) => {
    setPage(p);
    const target = colRefs.current[p - 1];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  // 사용자가 스크롤했을 때 근접 컬럼으로 페이지 인덱스 동기화(옵션)
  const onScroll = () => {
    const container = slotContainerRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let nearestIdx = 0;
    let minDist = Infinity;
    colRefs.current.forEach((el, idx) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    const newPage = nearestIdx + 1;
    if (newPage !== page) setPage(newPage);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* 슬롯 영역 */}
      <div
        ref={slotContainerRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-2"
      >
        <div className="flex h-full gap-8">
          {dummyGacha.map((item, index) => (
            <div
              key={index}
              ref={setColRef}
              className="grid h-full shrink-0 snap-center grid-rows-3 gap-4"
            >
              <SlotSingle row={+item.id} col={3} />
              <SlotSingle row={+item.id} col={2} />
              <SlotSingle row={+item.id} col={1} />
            </div>
          ))}
        </div>
      </div>

      {/* pagination 영역 */}
      <div className="flex h-16 items-center gap-4 overflow-x-auto">
        <div className="inline-flex gap-2">
          {pageList.map((p) => (
            <div
              key={p}
              onClick={() => handlePageChange(p)}
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border-2 transition-all ${page === p ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotPageView;
