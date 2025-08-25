'use client';

import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedSlotAtom } from '../jotai/atom';
import { SlotProduct } from '@/modules/slot/lib/types';

type Action = 'random' | 'stock' | 'delete';

type OnClick = (action: Action) => void;

interface UseSlotProductActionsParams {
  /** 액션 버튼 클릭 시 실행되는 콜백. 액션 타입을 인자로 받음 */
  onClick: OnClick;
  /** 외부 모달 제어 등, 액션 이후 열림 상태를 닫을 때 사용 */
  handleOpenChange?: (open: boolean) => void;
  selectedProduct: SlotProduct | undefined;
  actionType?: 'replace' | 'remain';
}

/** 슬롯에 할당된 상품을 초기화하고 목적지로 이동시키는 커스텀 훅 */
export function useSlotProductActions({
  onClick,
  handleOpenChange,
  selectedProduct,
  actionType = 'replace'
}: UseSlotProductActionsParams) {
  const setSelectedSlot = useSetAtom(selectedSlotAtom);

  /** 선택된 슬롯의 product만 안전하게 초기화 */
  const clearProduct = useCallback(() => {
    setSelectedSlot((prev) => (prev ? { ...prev, product: undefined } : prev));
  }, [setSelectedSlot]);

  // todo: 기존의 상품, 즉 slot에 있는 상품을 처리하는 로직이 필요함.
  // 그리고 선택한 상품은 슬롯에 추가 되어야함.
  // 현재 함수들이 동일한 로직을 반복하고 있으나, 기능 추가되면 변경

  /** 랜덤 슬롯으로 이동 */
  const moveProductToRandomSlot = useCallback(
    (type: Action) => {
      clearProduct();
      onClick(type);
      handleOpenChange?.(false);

      if (actionType === 'remain') {
        setSelectedSlot((prev) => ({
          ...prev,
          product: undefined
        }));
      } else {
        setSelectedSlot((prev) => ({
          ...prev,
          product: selectedProduct
        }));
      }
    },
    [clearProduct, onClick, handleOpenChange, selectedProduct]
  );

  /** 재고로 이동 */
  const moveProductToStock = useCallback(
    (type: Action) => {
      clearProduct();
      onClick(type);
      handleOpenChange?.(false);
      if (actionType === 'remain') {
        setSelectedSlot((prev) => ({
          ...prev,
          product: undefined
        }));
      } else {
        setSelectedSlot((prev) => ({
          ...prev,
          product: selectedProduct
        }));
      }
    },
    [clearProduct, onClick, handleOpenChange, selectedProduct]
  );

  /** 현재 슬롯에서 상품 제거 */
  const removeProductFromSlot = useCallback(
    (type: Action) => {
      clearProduct();
      onClick(type);
      handleOpenChange?.(false);
      setSelectedSlot((prev) => ({
        ...prev,
        product: selectedProduct
      }));
    },
    [clearProduct, onClick, handleOpenChange, selectedProduct]
  );

  return {
    moveProductToRandomSlot,
    moveProductToStock,
    removeProductFromSlot
  };
}
