'use client';
import { Card, CardContent } from '@/shared/ui/shadcn/card';
import React, { useEffect, useState } from 'react';
import { MapCell } from '../SlotMap';
import { SlotProduct } from '@/modules/slot/lib';
import { ParentLocation, SelectedCell, Slot } from '@/modules/slot/lib/types';

export const GridMap = ({
  mapSize,
  selectedLocationCell,
  selectedStockProduct,
  status,
  getLocationsInCell,
  getParentLocation,
  isAdmin,
  handleLocationCellClick
}: {
  mapSize: { rows: number; cols: number };
  selectedLocationCell: SelectedCell;
  selectedStockProduct: SlotProduct | null;
  status: 'add' | 'view' | 'old' | 'empty' | null;
  getLocationsInCell: (row: number, col: number) => Slot[];
  getParentLocation: (row: number, col: number) => ParentLocation | undefined;
  isAdmin: boolean;
  handleLocationCellClick: (row: number, col: number) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-scroll">
          <div
            className="grid min-w-max gap-3"
            style={{
              gridTemplateColumns: `repeat(${mapSize.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${mapSize.rows}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: mapSize.rows * mapSize.cols }, (_, index) => {
              const row = Math.floor(index / mapSize.cols);
              const col = index % mapSize.cols;
              const cellLocations = getLocationsInCell(row, col);
              const parentLocation = getParentLocation(row, col);

              // admin이 아닐 때는 부모 위치 정보가 있는 슬롯만 보이도록 처리
              // 현재 status가 add상태일땐 상품 재고 빈곳을 찾는거라서 부모 정보가 있는 슬롯만 보이도록 처리

              const shouldShow =
                status === 'add'
                  ? !!parentLocation
                  : isAdmin || !!parentLocation;

              return (
                <MapCell
                  key={`${row}-${col}`}
                  row={row}
                  col={col}
                  cellLocations={cellLocations}
                  parentLocation={parentLocation || undefined}
                  isSelected={
                    selectedLocationCell?.row === row &&
                    selectedLocationCell?.col === col
                  }
                  onClick={() => handleLocationCellClick(row, col)}
                  className={!shouldShow ? 'invisible' : ''}
                  selectedStockProduct={selectedStockProduct}
                  status={status}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
