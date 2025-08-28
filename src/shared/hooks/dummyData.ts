import { ParentLocation, Slot } from '@/modules/slot/lib';

export const dummyGacha = [
  {
    id: '1',
    name: 'lovot 가챠',
    image: '/lovot.jpg',
    price: 1,
    quantity: 1,
    inStockDate: new Date()
  },
  {
    id: '2',
    name: 'mofusand',
    image: '/gacha1.jpg',
    price: 2,
    quantity: 2,
    inStockDate: new Date()
  },
  {
    id: '3',
    name: 'lovot2',
    image: '/gacha2.jpg',
    price: 3,
    quantity: 3,
    inStockDate: new Date()
  },
  {
    id: '4',
    name: '이누야샤',
    image: '/gacha3.jpg',
    price: 3,
    quantity: 4,
    inStockDate: new Date()
  },
  {
    id: '5',
    name: 'lovot3',
    image: '/gacha4.jpg',
    price: 3,
    quantity: 5,
    inStockDate: new Date()
  },
  {
    id: '6',
    name: 'lovot 키링',
    image: '/gacha5.jpg',
    price: 2,
    quantity: 6,
    inStockDate: new Date()
  },
  {
    id: '7',
    name: '햄토리',
    image: '/gacha6.jpg',
    price: 4,
    quantity: 7,
    inStockDate: new Date()
  },
  {
    id: '8',
    name: '햄토리6',
    image: '/gacha6.jpg',
    price: 6,
    quantity: 7,
    inStockDate: new Date()
  },
  {
    id: '9',
    name: 'lovot 키링',
    image: '/gacha5.jpg',
    price: 2,
    quantity: 6,
    inStockDate: new Date()
  },
  {
    id: '10',
    name: '햄토리',
    image: '/gacha6.jpg',
    price: 4,
    quantity: 7,
    inStockDate: new Date()
  },
  {
    id: '11',
    name: '햄토리6',
    image: '/gacha6.jpg',
    price: 6,
    quantity: 7,
    inStockDate: new Date()
  }
];

export const initialMockParentLocations: ParentLocation[] = [
  {
    id: '1',
    row: 1,
    col: 1,
    name: '메인 음료 구역'
  },
  {
    id: '4',
    row: 2,
    col: 3,
    name: '메인 음료 구역'
  },
  {
    id: '5',
    row: 2,
    col: 4,
    name: '프리미엄 음료'
  },
  {
    id: '6',
    row: 3,
    col: 5,
    name: '스낵 구역'
  },
  {
    id: '7',
    row: 4,
    col: 6,
    name: '할인 상품'
  },
  {
    id: '2-1',
    row: 2,
    col: 1,
    name: ''
  },
  {
    id: '3-1',
    row: 3,
    col: 1,
    name: ''
  },
  {
    id: '4-1',
    row: 4,
    col: 1,
    name: ''
  },
  {
    id: '5-1',
    row: 5,
    col: 1,
    name: ''
  },
  {
    id: '6-1',
    row: 6,
    col: 1,
    name: ''
  },
  {
    id: '7-1',
    row: 7,
    col: 1,
    name: ''
  },
  {
    id: '8-1',
    row: 8,
    col: 1,
    name: ''
  },
  {
    id: '1-4',
    row: 1,
    col: 4,
    name: ''
  },
  {
    id: '1-5',
    row: 1,
    col: 5,
    name: ''
  },
  {
    id: '1-6',
    row: 1,
    col: 6,
    name: ''
  },
  {
    id: '1-7',
    row: 1,
    col: 7,
    name: ''
  },
  {
    id: '1-8',
    row: 1,
    col: 8,
    name: ''
  },
  {
    id: '2-8',
    row: 2,
    col: 8,
    name: ''
  },
  {
    id: '3-8',
    row: 3,
    col: 8,
    name: ''
  },
  {
    id: '4-8',
    row: 4,
    col: 8,
    name: ''
  },
  {
    id: '5-8',
    row: 5,
    col: 8,
    name: ''
  },
  {
    id: '6-8',
    row: 6,
    col: 8,
    name: ''
  },
  {
    id: '7-8',
    row: 7,
    col: 8,
    name: ''
  },
  {
    id: '8-8',
    row: 8,
    col: 8,
    name: ''
  },
  {
    id: '7-3',
    row: 7,
    col: 3,
    name: ''
  },
  {
    id: '7-4',
    row: 7,
    col: 4,
    name: ''
  },
  {
    id: '7-5',
    row: 7,
    col: 5,
    name: ''
  },
  {
    id: '7-6',
    row: 7,
    col: 6,
    name: ''
  },
  {
    id: '1-3',
    row: 1,
    col: 3,
    name: ''
  },
  {
    id: '1-2',
    row: 1,
    col: 2,
    name: ''
  }
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
      inStockDate: new Date('2025-08-26T02:58:02.554Z')
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
      inStockDate: new Date('2025-08-26T02:58:02.554Z')
    }
  },
  {
    id: '2-3-2',
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
      inStockDate: new Date('2025-08-18T02:58:02.554Z')
    }
  },
  {
    id: '2-3-1',
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
      inStockDate: new Date('2025-08-26T02:58:02.554Z')
    }
  },
  {
    id: '2-4-2',
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
      inStockDate: new Date('2025-08-24T02:58:02.554Z')
    }
  },
  {
    id: '3-5-2',
    parentId: '3-5',
    row: 3,
    col: 5,
    layer: 'middle',
    price: 3,
    maxQuantity: 8,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-6-3',
    parentId: '4-6',
    row: 4,
    col: 6,
    layer: 'bottom',
    price: 100,
    maxQuantity: 5,
    currentQuantity: 5,
    status: 'inactive',
    product: {
      id: '5',
      name: 'lovot3',
      image: '/gacha4.jpg',
      price: 5,
      quantity: 15,
      inStockDate: new Date('2025-08-16T02:58:02.554Z')
    }
  },
  {
    id: '2-1-1',
    parentId: '2-1',
    row: 2,
    col: 1,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '2-1-2',
    parentId: '2-1',
    row: 2,
    col: 1,
    layer: 'middle',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '2-1-3',
    parentId: '2-1',
    row: 2,
    col: 1,
    layer: 'bottom',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-1-1',
    parentId: '3-1',
    row: 3,
    col: 1,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-1-2',
    parentId: '3-1',
    row: 3,
    col: 1,
    layer: 'middle',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-1-3',
    parentId: '3-1',
    row: 3,
    col: 1,
    layer: 'bottom',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-1-1',
    parentId: '4-1',
    row: 4,
    col: 1,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-1-2',
    parentId: '4-1',
    row: 4,
    col: 1,
    layer: 'middle',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-1-3',
    parentId: '4-1',
    row: 4,
    col: 1,
    layer: 'bottom',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-1-1',
    parentId: '5-1',
    row: 5,
    col: 1,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-1-2',
    parentId: '5-1',
    row: 5,
    col: 1,
    layer: 'middle',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-1-3',
    parentId: '5-1',
    row: 5,
    col: 1,
    layer: 'bottom',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-1-1',
    parentId: '6-1',
    row: 6,
    col: 1,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-1-2',
    parentId: '6-1',
    row: 6,
    col: 1,
    layer: 'middle',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-1-3',
    parentId: '6-1',
    row: 6,
    col: 1,
    layer: 'bottom',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-1-1',
    parentId: '7-1',
    row: 7,
    col: 1,
    layer: 'top',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-1-2',
    parentId: '7-1',
    row: 7,
    col: 1,
    layer: 'middle',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-1-3',
    parentId: '7-1',
    row: 7,
    col: 1,
    layer: 'bottom',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-1-1',
    parentId: '8-1',
    row: 8,
    col: 1,
    layer: 'top',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-1-2',
    parentId: '8-1',
    row: 8,
    col: 1,
    layer: 'middle',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-1-3',
    parentId: '8-1',
    row: 8,
    col: 1,
    layer: 'bottom',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-4-1',
    parentId: '1-4',
    row: 1,
    col: 4,
    layer: 'top',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-4-2',
    parentId: '1-4',
    row: 1,
    col: 4,
    layer: 'middle',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-4-3',
    parentId: '1-4',
    row: 1,
    col: 4,
    layer: 'bottom',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-5-1',
    parentId: '1-5',
    row: 1,
    col: 5,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-5-2',
    parentId: '1-5',
    row: 1,
    col: 5,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-5-3',
    parentId: '1-5',
    row: 1,
    col: 5,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-6-1',
    parentId: '1-6',
    row: 1,
    col: 6,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-6-2',
    parentId: '1-6',
    row: 1,
    col: 6,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-6-3',
    parentId: '1-6',
    row: 1,
    col: 6,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-7-1',
    parentId: '1-7',
    row: 1,
    col: 7,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-7-2',
    parentId: '1-7',
    row: 1,
    col: 7,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-7-3',
    parentId: '1-7',
    row: 1,
    col: 7,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-8-1',
    parentId: '1-8',
    row: 1,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-8-2',
    parentId: '1-8',
    row: 1,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-8-3',
    parentId: '1-8',
    row: 1,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '2-8-1',
    parentId: '2-8',
    row: 2,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '2-8-2',
    parentId: '2-8',
    row: 2,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '2-8-3',
    parentId: '2-8',
    row: 2,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-8-1',
    parentId: '3-8',
    row: 3,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-8-2',
    parentId: '3-8',
    row: 3,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '3-8-3',
    parentId: '3-8',
    row: 3,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-8-1',
    parentId: '4-8',
    row: 4,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-8-2',
    parentId: '4-8',
    row: 4,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '4-8-3',
    parentId: '4-8',
    row: 4,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-8-1',
    parentId: '5-8',
    row: 5,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-8-2',
    parentId: '5-8',
    row: 5,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '5-8-3',
    parentId: '5-8',
    row: 5,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-8-1',
    parentId: '6-8',
    row: 6,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-8-2',
    parentId: '6-8',
    row: 6,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '6-8-3',
    parentId: '6-8',
    row: 6,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-8-1',
    parentId: '7-8',
    row: 7,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-8-2',
    parentId: '7-8',
    row: 7,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-8-3',
    parentId: '7-8',
    row: 7,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-8-1',
    parentId: '8-8',
    row: 8,
    col: 8,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-8-2',
    parentId: '8-8',
    row: 8,
    col: 8,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '8-8-3',
    parentId: '8-8',
    row: 8,
    col: 8,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-3-1',
    parentId: '7-3',
    row: 7,
    col: 3,
    layer: 'top',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-3-2',
    parentId: '7-3',
    row: 7,
    col: 3,
    layer: 'middle',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-3-3',
    parentId: '7-3',
    row: 7,
    col: 3,
    layer: 'bottom',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-4-1',
    parentId: '7-4',
    row: 7,
    col: 4,
    layer: 'top',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-4-2',
    parentId: '7-4',
    row: 7,
    col: 4,
    layer: 'middle',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-4-3',
    parentId: '7-4',
    row: 7,
    col: 4,
    layer: 'bottom',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-5-1',
    parentId: '7-5',
    row: 7,
    col: 5,
    layer: 'top',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-5-2',
    parentId: '7-5',
    row: 7,
    col: 5,
    layer: 'middle',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-5-3',
    parentId: '7-5',
    row: 7,
    col: 5,
    layer: 'bottom',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-6-1',
    parentId: '7-6',
    row: 7,
    col: 6,
    layer: 'top',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-6-2',
    parentId: '7-6',
    row: 7,
    col: 6,
    layer: 'middle',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '7-6-3',
    parentId: '7-6',
    row: 7,
    col: 6,
    layer: 'bottom',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-3-1',
    parentId: '1-3',
    row: 1,
    col: 3,
    layer: 'top',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-3-2',
    parentId: '1-3',
    row: 1,
    col: 3,
    layer: 'middle',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-3-3',
    parentId: '1-3',
    row: 1,
    col: 3,
    layer: 'bottom',
    price: 1,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-2-1',
    parentId: '1-2',
    row: 1,
    col: 2,
    layer: 'top',
    price: 2,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-2-2',
    parentId: '1-2',
    row: 1,
    col: 2,
    layer: 'middle',
    price: 3,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  },
  {
    id: '1-2-3',
    parentId: '1-2',
    row: 1,
    col: 2,
    layer: 'bottom',
    price: 4,
    maxQuantity: 30,
    currentQuantity: 0,
    status: 'active'
  }
];
