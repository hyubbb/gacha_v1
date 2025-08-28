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
import { useSlotProductActions } from '@/modules/slot/hooks';

export const RemainModal = () => {
  const [remainModal, setRemainModal] = useAtom(remainModalAtom);
  const { open, onClick, product } = remainModal;
  const { moveProductToRandomSlot, moveProductToStock } = useSlotProductActions(
    {
      onClick,
      handleOpenChange: (open) => {
        setRemainModal({ ...remainModal, open });
      },
      selectedProduct: product || undefined,
      actionType: 'remain'
    }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => setRemainModal({ ...remainModal, open })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>잔여 상품을 정리하시겠습니까?</DialogTitle>
          <DialogDescription>
            {product?.name} 상품이 잔여상품 {product?.quantity}개가 남아있어요.
            <br />
            잔여상품을 정리할 방법을 선택해 주세요.
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
