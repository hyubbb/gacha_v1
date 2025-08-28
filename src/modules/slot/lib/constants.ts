// Constants
export const LAYER_NAMES = ['top', 'middle', 'bottom'] as const;
export const LAYER_KOREAN = {
  top: '상단',
  middle: '중단',
  bottom: '하단'
} as const;
export const LAYER_NUMBERS = { top: '1', middle: '2', bottom: '3' } as const;
export const MAX_QUANTITY = 30;
export const MIN_QUANTITY = 1;
export const DEFAULT_MAX_QUANTITY = 30;
export const STALE_INVENTORY_DAYS = 7;
export const LOW_STOCK_THRESHOLD = 0.3;
