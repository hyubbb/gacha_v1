import { ReplaceModal } from '@/modules/slot/components/modal/ReplaceModal';
import { RemainModal } from '@/modules/slot/components/modal/RemainModal';
import { CoinModifyModal } from '@/shared/ui/modal/CoinModifyModal';
import { ProductDetailModal } from '@/shared/ui/modal/ProductDetailModal';
import { Toaster } from '@/shared/ui/shadcn/toaster';
import { MiniToast } from '@/shared/ui/toast/MiniToast';
import { ToastContainer } from 'react-toastify';
import { CoinNotSlotModal } from '@/modules/slot/components/modal/CoinNotSlotModal';

/*
  UIProvider를 통해 dialog와 sheet를 전역에서 렌더링하고 있음.
  "전역에서 사용되지 않는 컴포넌트는 해당 위치에서만 렌더링하는 것이 좋다"는 @paul의 피드백을 받아서 일부는 페이지나 컴포넌트 단위로 분리함.
  현재는 우선순위 문제로 점진적으로 분리 중이며, 전역과 국지적 사용이 혼합된 상태로 유지되고 있음. @chloe
*/
export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* toaster */}
      <Toaster />
      <ToastContainer />
      <MiniToast />
      {/* modal */}
      <CoinModifyModal />
      <ProductDetailModal />
      <ReplaceModal />
      <RemainModal />
      <CoinNotSlotModal />
    </>
  );
}
