import { ParentLocation, Slot } from '../lib/types';

export const initialMockParentLocations: ParentLocation[] = [
  { id: '1-1', row: 1, col: 1, name: '메인 음료 구역' },
  { id: '1-2', row: 1, col: 2, name: '메인 음료 구역' },
  { id: '1-3', row: 1, col: 3, name: '메인 음료 구역' },
  { id: '2-3', row: 2, col: 3, name: '메인 음료 구역' },
  { id: '2-4', row: 2, col: 4, name: '프리미엄 음료' },
  { id: '3-5', row: 3, col: 5, name: '스낵 구역' },
  { id: '4-6', row: 4, col: 6, name: '할인 상품' }
];

export const initialMockLocations: Slot[] = [
  {
    id: '1-1-1',
    parentId: '1-1',
    row: 1,
    col: 1,
    layer: 'top',
    price: 3,
    maxQuantity: 20,
    currentQuantity: 10,
    status: 'active',
    product: {
      id: '1',
      name: 'lovot 가챠',
      image: '/lovot.jpg',
      price: 1,
      quantity: 11,
      inStockDate: new Date()
    }
  },
  {
    id: '1-1-2',
    parentId: '1-1',
    row: 1,
    col: 1,
    layer: 'middle',
    price: 3,
    maxQuantity: 20,
    currentQuantity: 10,
    status: 'active',
    product: {
      id: '1',
      name: 'lovot 가챠',
      image: '/lovot.jpg',
      price: 1,
      quantity: 11,
      inStockDate: new Date()
    }
  },
  {
    id: '2-3-2', // parentId-layerNumber
    parentId: '2-3',
    row: 2,
    col: 3,
    layer: 'middle',
    price: 200,
    maxQuantity: 10,
    currentQuantity: 7,
    status: 'active',
    product: {
      id: '2',
      name: 'mofusand',
      image: '/gacha1.jpg',
      price: 2,
      quantity: 12,
      inStockDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8일 전 (노란색 표시 대상)
    }
  },
  {
    id: '2-3-1', // parentId-layerNumber
    parentId: '2-3',
    row: 2,
    col: 3,
    layer: 'top',
    price: 250,
    maxQuantity: 10,
    currentQuantity: 2,
    status: 'active',
    product: {
      id: '3',
      name: 'lovot2',
      image: '/gacha2.jpg',
      price: 3,
      quantity: 13,
      inStockDate: new Date() // 오늘 입고 (초록색)
    }
  },
  {
    id: '2-4-2', // parentId-layerNumber
    parentId: '2-4',
    row: 2,
    col: 4,
    layer: 'middle',
    price: 300,
    maxQuantity: 10,
    currentQuantity: 3,
    status: 'active',
    product: {
      id: '4',
      name: '이누야샤',
      image: '/gacha3.jpg',
      price: 4,
      quantity: 14,
      inStockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2일 전 (초록색)
    }
  },
  {
    id: '3-5-2', // parentId-layerNumber
    parentId: '3-5',
    row: 3,
    col: 5,
    layer: 'middle',
    price: 300,
    maxQuantity: 8,
    currentQuantity: 0,
    status: 'active' // 빈 위치
  },
  {
    id: '4-6-3', // parentId-layerNumber
    parentId: '4-6',
    row: 4,
    col: 6,
    layer: 'bottom',
    price: 100,
    maxQuantity: 5,
    currentQuantity: 5,
    status: 'inactive', // 비활성 위치
    product: {
      id: '5',
      name: 'lovot3',
      image: '/gacha4.jpg',
      price: 5,
      quantity: 15,
      inStockDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10일 전
    }
  }
];

let currentMockLocations: Slot[] = [...initialMockLocations];
let currentMockParentLocations: ParentLocation[] = [
  ...initialMockParentLocations
];

export const getMockLocations = () => [...currentMockLocations];
export const getMockParentLocations = () => [...currentMockParentLocations];

export const updateMockLocation = (updatedLocation: Slot) => {
  currentMockLocations = currentMockLocations.map((s) =>
    s.id === updatedLocation.id ? updatedLocation : s
  );
};

export const updateMockParentLocation = (
  updatedParentLocation: ParentLocation
) => {
  currentMockParentLocations = currentMockParentLocations.map((ps) =>
    ps.id === updatedParentLocation.id ? updatedParentLocation : ps
  );
};

export const addMockParentLocation = (newParentLocation: ParentLocation) => {
  currentMockParentLocations.push(newParentLocation);
};

export const deleteMockParentLocation = (parentLocationId: string) => {
  currentMockParentLocations = currentMockParentLocations.filter(
    (ps) => ps.id !== parentLocationId
  );
  currentMockLocations = currentMockLocations.filter(
    (s) => s.parentId !== parentLocationId
  ); // 자식 위치도 함께 삭제
};

export const addMockLocation = (newLocation: Slot) => {
  currentMockLocations.push(newLocation);
};

export const deleteMockLocation = (locationId: string) => {
  currentMockLocations = currentMockLocations.filter(
    (s) => s.id !== locationId
  );
};
