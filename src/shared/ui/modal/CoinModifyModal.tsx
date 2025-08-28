'use client';
import { selectedStockProductAtom } from '@/modules/product/jotai/atom';
import { coinModifyModalAtom, miniToastAtom } from '@/shared/jotai/atom';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input
} from '@/shared';
import { useAtom } from 'jotai';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SlotProduct } from '@/modules/slot/lib';
import { useRouter } from 'next/navigation';
import { hasAvailableSlots } from '@/modules/slot/lib/utils/utils';
import { slotLocationAtom } from '@/modules/slot/jotai/atom';

export const CoinModifyModal = () => {
  const [coinModifyModal, setCoinModifyModal] = useAtom(coinModifyModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const { title, description, open, coin, onSubmit } = coinModifyModal;
  const [selectedStockProduct, setSelectedStockProduct] = useAtom(
    selectedStockProductAtom
  );
  const [locations, setLocations] = useAtom(slotLocationAtom);
  const [draftCoin, setDraftCoin] = useState(selectedStockProduct?.price || 1);
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    setCoinModifyModal({ ...coinModifyModal, open });
  };

  const [error, setError] = useState(false);

  const handleDraftCoinChange = (draftCoin: number) => {
    if (Number.isNaN(draftCoin) || draftCoin < 1) return;
    setDraftCoin(Math.max(1, Math.floor(draftCoin)));
  };

  const handleSubmit = () => {
    // 코인에 맞는 빈 슬롯이 없습니다.
    const isAvailable = hasAvailableSlots(locations, draftCoin);
    if (!isAvailable) {
      setError(true);
      return;
    }
    setCoinModifyModal({ ...coinModifyModal, open: false });
    setSelectedStockProduct({
      ...selectedStockProduct,
      price: draftCoin
    } as SlotProduct);
    setMiniToast({
      ...miniToast,
      open: true,
      message: '슬롯의 코인이 변경되었습니다.',
      position: 'bottom'
    });
    router.push('/display?status=add');
  };

  useEffect(() => {
    if (selectedStockProduct) {
      setDraftCoin(selectedStockProduct.price);
    }
  }, [selectedStockProduct]);

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
          {error && (
            <div className="text-red-500">코인에 맞는 빈 슬롯이 없습니다.</div>
          )}

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
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
