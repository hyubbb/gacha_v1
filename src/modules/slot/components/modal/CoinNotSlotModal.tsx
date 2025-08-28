'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  useToast
} from '@/shared';
import { Button } from '@/shared';
import { useAtom } from 'jotai';
import { coinNotSlotModalAtom } from '../../jotai/atom';
import { coinModifyModalAtom } from '@/shared/jotai/atom';
import { useRouter } from 'next/navigation';

export const CoinNotSlotModal = ({}) => {
  const [coinNotSlotModal, setCoinNotSlotModal] = useAtom(coinNotSlotModalAtom);
  const [coinModifyModal, setCoinModifyModal] = useAtom(coinModifyModalAtom);
  const { open, onClick } = coinNotSlotModal;
  const router = useRouter();
  // const { toast, dismiss } = useToast();

  const handleClose = () => {
    setCoinNotSlotModal({ open: false });
  };

  const handleCoinModify = () => {
    // dismiss();
    setCoinModifyModal({
      open: true,
      title: '상품 코인을 변경하시겠어요?',
      description: '변경하고자 하는 코인 수를 입력하세요.'
    });
  };

  const handleEmptySlot = () => {
    // router.push('/display?status=empty');
    // toast({
    //   title: '상품 코인을 변경하시겠어요?',
    //   description: '코인을 변경하지 않아도 등록은 가능해요',
    //   action: (
    //     <Button variant="outline" size="sm" onClick={handleCoinModify}>
    //       변경
    //     </Button>
    //   ),
    //   duration: 10000
    // });
    handleClose();
  };

  const handleOldSlot = () => {
    router.push('/display?status=old');
    handleClose();
  };

  const handleStockProduct = () => {
    router.push('/stock/list');
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setCoinNotSlotModal({ open })}>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-center">
            코인에 맞는 빈 슬롯이 없습니다.
          </DialogTitle>
          <DialogDescription className="text-center">
            다른 슬롯에 상품을 배치할 수 있습니다.
            <br />
            다른 슬롯을 추천해 드릴까요?
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-1 flex-col items-center gap-2 p-3">
          <Button
            variant="default"
            size="xl"
            className="w-full"
            onClick={handleEmptySlot}
          >
            비어있는 모든 슬롯 보기
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="w-full"
            onClick={handleOldSlot}
          >
            오래된 슬롯 보기
          </Button>
          <Button
            variant="ghost"
            size="xl"
            className="w-full"
            onClick={handleStockProduct}
          >
            재고 상품으로 등록
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
