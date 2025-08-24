'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Button } from '@/shared/ui/shadcn/button';
import { DialogHeader } from '@/shared/ui/shadcn/dialog';
import { useAtom } from 'jotai';
import { remainModalAtom } from '@/modules/slot/jotai/atom';

export const RemainModal = () => {
  const [remainModal, setRemainModal] = useAtom(remainModalAtom);
  const { open, onClick } = remainModal;

  const handleOpenChange = (open: boolean) => {
    setRemainModal({ ...remainModal, open });
  };

  const handleRandomMove = () => {
    onClick('random');
    handleOpenChange(false);
  };

  const handleStockMove = () => {
    onClick('stock');
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>잔여 상품을 정리하시겠습니까?</DialogTitle>
          <DialogDescription>
            슬롯에 잔여상품 N개가 남아있어요.
            <br />
            잔여상품을 정리할 방법을 선택해 주세요.
          </DialogDescription>
        </DialogHeader>
        {/* 이전과 동일한 암호일때 오류 발생 */}
        <DialogFooter>
          <div className="flex flex-col space-y-3 p-2">
            <Button variant="default" size="lg" onClick={handleRandomMove}>
              랜덤 슬롯으로 이동
            </Button>
            <Button variant="outline" size="lg" onClick={handleStockMove}>
              재고로 이동
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
