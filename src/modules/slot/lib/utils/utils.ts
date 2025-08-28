import { Slot } from '@/shared/lib';
import { STALE_INVENTORY_DAYS, LOW_STOCK_THRESHOLD } from '../constants';

export const getLayerColor = (location: Slot | undefined): string => {
  if (!location) return 'bg-gray-100 border-gray-200 border-[1px]';

  if (location.product && location.product.inStockDate) {
    const sevenDaysAgo = new Date(
      Date.now() - STALE_INVENTORY_DAYS * 24 * 60 * 60 * 1000
    );
    if (location.product.inStockDate < sevenDaysAgo) {
      return 'bg-black-80 border-black-80';
    } else {
      return 'bg-black-50 border-black-50';
    }
  }

  switch (location.status) {
    case 'active':
      if (location.product) {
        if (location.currentQuantity === 0) return 'bg-red-100 border-red-300';
        if (
          location.currentQuantity <
          location.maxQuantity * LOW_STOCK_THRESHOLD
        )
          return 'bg-orange-100 border-orange-300';
        return 'bg-green-100 border-green-300';
      }
      return 'bg-transparent border-dark-20 border-[1px]';
    case 'inactive':
      return 'bg-gray-200 border-gray-400';
    case 'maintenance':
      return 'bg-purple-100 border-purple-300';
    default:
      return 'bg-gray-100 border-gray-200';
  }
};

export const hasPriceMismatch = (location: Slot | undefined): boolean => {
  return !!(location?.product && location.price !== location.product.price);
};

export const clampInt = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const getStoreDisplayName = (storeId: string): string => {
  const storeNames: Record<string, string> = {
    'store-001': '강남점',
    'store-002': '홍대점',
    'store-003': '명동점'
  };
  return storeNames[storeId] || storeId;
};

/**
 * 빈 슬롯 존재 여부 확인
 * 가격을 입력하면 해당 가격의 빈 슬롯 존재 여부 확인
 * @param allSlots 슬롯 목록
 * @param targetPrice 가격 (선택사항)
 * @returns 빈 슬롯 존재 여부
 */
export const hasAvailableSlots = (
  allSlots: Slot[],
  targetPrice?: number
): boolean => {
  return allSlots.some((slot) => {
    // 활성 상태이고 상품이 없는 슬롯들 중에서
    if (slot.status === 'active' && !slot.product) {
      // 가격이 지정된 경우 가격도 일치하는지 확인
      if (targetPrice !== undefined) {
        return slot.price === targetPrice;
      }
      return true;
    }
    return false;
  });
};

/**
 * 빈 슬롯 목록 반환
 * @param allSlots 슬롯 목록
 * @param targetPrice 가격 (선택사항)
 * @returns 빈 슬롯 목록
 */ export const getAvailableSlots = (
  allSlots: Slot[],
  targetPrice?: number
): Slot[] => {
  return allSlots.filter((slot) => {
    if (slot.status === 'active' && !slot.product) {
      if (targetPrice !== undefined) {
        return slot.price === targetPrice;
      }
      return true;
    }
    return false;
  });
};
