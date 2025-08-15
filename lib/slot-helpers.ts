// lib/slot-helpers.ts
import { getMockLocations, getMockParentLocations, updateMockLocation } from './mock-data'; // getMockSlots -> getMockLocations, getMockParentSlots -> getMockParentLocations, updateMockSlot -> updateMockLocation
import { Product, Slot, SuggestedLocation } from './types'; // SuggestedSlot -> SuggestedLocation (import from types)

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const getAvailableLocationsForProduct = (productPrice: number): SuggestedLocation[] => { // getAvailableSlotsForProduct -> getAvailableLocationsForProduct, SuggestedSlot -> SuggestedLocation
  const allLocations = getMockLocations(); // allSlots -> allLocations
  const allParentLocations = getMockParentLocations(); // allParentSlots -> allParentLocations
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_IN_MS);

  const suggested: SuggestedLocation[] = []; // SuggestedSlot -> SuggestedLocation

  for (const location of allLocations) { // slot -> location
    const parentLocation = allParentLocations.find(ps => ps.id === location.parentId); // parentSlot -> parentLocation
    const parentName = parentLocation?.name || `(${location.row}, ${location.col})`;

    // 1. 빈 위치 (가격 일치)
    if (location.status === 'active' && location.currentQuantity === 0 && location.price === productPrice) {
      suggested.push({ ...location, reason: 'empty', parentName });
    }
    // 2. 입고일이 오래된 상품이 있는 위치 (가격 일치)
    else if (
      location.status === 'active' &&
      location.product &&
      location.product.inStockDate &&
      location.product.inStockDate < sevenDaysAgo &&
      location.price === productPrice
    ) {
      suggested.push({ ...location, reason: 'old_stock', parentName });
    }
    // 3. 가격은 일치하지만 다른 조건에 해당하지 않는 위치
    else if (location.status === 'active' && location.price === productPrice) {
      // 위치에 이미 상품이 있고, 수량이 가득 차지 않았다면
      if (location.product && location.currentQuantity < location.maxQuantity) {
        suggested.push({ ...location, reason: 'price_match', parentName });
      } else if (!location.product) { // 빈 위치인데 가격이 맞는 경우 (empty에 포함되지만 혹시 모를 로직 상의 안전장치)
        suggested.push({ ...location, reason: 'price_match', parentName });
      }
    }
  }

  // 우선순위 정렬: 빈 위치 (동일 가격) > 오래된 재고 위치 (동일 가격) > 가격 일치 위치 (부분 재고)
  return suggested.sort((a, b) => {
    if (a.reason === 'empty' && b.reason !== 'empty') return -1;
    if (b.reason === 'empty' && a.reason !== 'empty') return 1;
    if (a.reason === 'old_stock' && b.reason === 'price_match') return -1;
    if (b.reason === 'old_stock' && a.reason === 'price_match') return 1;
    return 0;
  });
};

export const assignProductToMockLocation = (locationId: string, product: Product, quantity: number) => { // assignProductToMockSlot -> assignProductToMockLocation
  const allLocations = getMockLocations(); // allSlots -> allLocations
  const locationToUpdate = allLocations.find(s => s.id === locationId); // slotToUpdate -> locationToUpdate

  if (locationToUpdate) {
    const updatedLocation: Slot = { // updatedSlot -> updatedLocation
      ...locationToUpdate,
      currentQuantity: locationToUpdate.currentQuantity + quantity, // 기존 수량에 추가
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        inStockDate: locationToUpdate.product?.id === product.id ? locationToUpdate.product.inStockDate : new Date(), // 같은 상품이면 기존 입고일 유지, 아니면 오늘로
      },
      status: 'active' // 상품 할당 시 활성 상태로 변경
    };
    updateMockLocation(updatedLocation); // updateMockSlot -> updateMockLocation
    return true;
  }
  return false;
};

export const removeProductFromMockLocation = (locationId: string) => { // removeProductFromMockSlot -> removeProductFromMockLocation
  const allLocations = getMockLocations(); // allSlots -> allLocations
  const locationToUpdate = allLocations.find(s => s.id === locationId); // slotToUpdate -> locationToUpdate

  if (locationToUpdate) {
    const updatedLocation: Slot = { // updatedSlot -> updatedLocation
      ...locationToUpdate,
      currentQuantity: 0,
      product: undefined,
    };
    updateMockLocation(updatedLocation); // updateMockSlot -> updateMockLocation
    return true;
  }
  return false;
};
