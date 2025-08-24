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
import { replaceModalAtom } from '@/modules/slot/jotai/atom';

export const ReplaceModal = () => {
  const [replaceModal, setReplaceModal] = useAtom(replaceModalAtom);
  const { open, onClick } = replaceModal;

  const handleOpenChange = (open: boolean) => {
    setReplaceModal({ ...replaceModal, open });
  };

  const handleRandomMove = () => {
    onClick('random');
    handleOpenChange(false);
  };

  const handleStockMove = () => {
    onClick('stock');
    handleOpenChange(false);
  };

  const handleDeleteProduct = () => {
    onClick('delete');
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기존 상품을 어떻게 할까요?</DialogTitle>
          <DialogDescription>
            기존에 존재하는 상품을 <br /> 정리할 방법을 선택해 주세요.
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
            <Button
              variant="ghost"
              size="lg"
              className="hover:text-destructive"
              onClick={handleDeleteProduct}
            >
              기존 상품 폐기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
