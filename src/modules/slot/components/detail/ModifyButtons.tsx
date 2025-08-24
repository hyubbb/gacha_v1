import React from 'react';
import { Button } from '@/shared/ui/shadcn/button';
import { useAtom, useAtomValue } from 'jotai';
import { remainModalAtom, selectedSlotAtom } from '@/modules/slot/jotai/atom';
import { useRouter } from 'next/navigation';
import { miniToastAtom } from '@/shared/jotai/atom';

export const ModifyButtons = () => {
  const selectedSlot = useAtomValue(selectedSlotAtom);
  const router = useRouter();
  const [remainModal, setRemainModal] = useAtom(remainModalAtom);
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const handleProductReplace = () => {
    console.log('상품 교체 클릭');
    router.push(`/display/list/${selectedSlot?.id}/change`);
  };

  const handleRemainProduct = () => {
    setRemainModal({
      open: true,
      onClick: (type: 'random' | 'stock') => {
        const cnt = 3;
        setMiniToast({
          open: true,
          message: `잔여 상품 ${cnt}개 정리했습니다.`,
          time: 2000
        });
      }
    });
    console.log('남은 상품 클릭');
  };

  const handleProductRegister = () => {
    console.log('상품 등록 클릭');
    router.push(`/display/list/${selectedSlot?.id}/add`);
  };

  return (
    <section className="flex gap-2">
      {selectedSlot?.product ? (
        <>
          <Button
            className="h-12 flex-1"
            variant="outline"
            size="lg"
            onClick={handleRemainProduct}
          >
            전여 정리
          </Button>
          <Button
            className="h-12 flex-1"
            variant="default"
            size="lg"
            onClick={handleProductReplace}
          >
            상품 교체
          </Button>
        </>
      ) : (
        <Button
          className="h-12 flex-1"
          variant="default"
          size="lg"
          onClick={handleProductRegister}
        >
          상품 등록
        </Button>
      )}
    </section>
  );
};
