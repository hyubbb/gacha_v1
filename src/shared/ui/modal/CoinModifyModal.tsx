'use client';
import { coinModifyModalAtom, miniToastAtom } from '@/shared/jotai/atom';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  toast
} from '@/shared';
import { useAtom } from 'jotai';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export const CoinModifyModal = () => {
  const [coinModifyModal, setCoinModifyModal] = useAtom(coinModifyModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const { title, description, open, coin, onSubmit } = coinModifyModal;
  const [draftCoin, setDraftCoin] = useState(coinModifyModal.coin);

  const handleOpenChange = (open: boolean) => {
    setCoinModifyModal({ ...coinModifyModal, open });
  };

  const handleDraftCoinChange = (draftCoin: number) => {
    if (Number.isNaN(draftCoin) || draftCoin < 1) return;
    setDraftCoin(Math.max(1, Math.floor(draftCoin)));
  };

  const handleSubmit = () => {
    onSubmit(draftCoin);
    setCoinModifyModal({ ...coinModifyModal, open: false });
    setMiniToast({
      ...miniToast,
      open: true,
      message: '슬롯의 코인이 변경되었습니다.',
      position: 'top'
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-4">
            <Minus
              className="h-4 w-4 cursor-pointer"
              onClick={() => handleDraftCoinChange(draftCoin - 1)}
            />
            <Input
              type="text"
              className="w-20 border-none text-center"
              min={1}
              value={draftCoin}
              onChange={(e: any) =>
                handleDraftCoinChange(Number(e.target.value))
              }
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <Plus
              className="h-4 w-4 cursor-pointer"
              onClick={() => handleDraftCoinChange(draftCoin + 1)}
            />
          </div>

          <Button
            className="w-full"
            variant="default"
            size="lg"
            onClick={handleSubmit}
            disabled={draftCoin === coin} // 값이 동일하면 비활성화
          >
            변경하기
          </Button>
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={handleSubmit}
            disabled={draftCoin === coin} // 값이 동일하면 비활성화
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
