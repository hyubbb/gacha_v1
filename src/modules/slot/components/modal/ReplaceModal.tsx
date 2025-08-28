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
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { replaceModalAtom, selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { useSlotProductActions } from '@/modules/slot/hooks';

export const ReplaceModal = () => {
  const [replaceModal, setReplaceModal] = useAtom(replaceModalAtom);
  const { open, onClick, product } = replaceModal;

  const { moveProductToRandomSlot, moveProductToStock, removeProductFromSlot } =
    useSlotProductActions({
      onClick,
      handleOpenChange: (open) => {
        setReplaceModal({ ...replaceModal, open });
      },
      selectedProduct: product || undefined
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => setReplaceModal({ ...replaceModal, open })}
    >
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
            <Button
              variant="default"
              size="lg"
              onClick={() => moveProductToRandomSlot('random')}
            >
              랜덤 슬롯으로 이동
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => moveProductToStock('stock')}
            >
              재고로 이동
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="hover:text-destructive"
              onClick={() => removeProductFromSlot('delete')}
            >
              기존 상품 폐기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
