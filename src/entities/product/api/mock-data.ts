import { Product } from '../model'

export const initialMockProducts: Product[] = [
  {
    id: 'prod-1',
    name: '코카콜라 500ml',
    image: '/placeholder.svg?height=50&width=50&text=CocaCola',
    price: 200,
    quantity: 50,
    inStockDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8일 전
  },
  {
    id: 'prod-2',
    name: '펩시콜라 500ml',
    image: '/placeholder.svg?height=50&width=50&text=Pepsi',
    price: 200,
    quantity: 30,
    inStockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2일 전
  },
  {
    id: 'prod-3',
    name: '포카칩 오리지널',
    image: '/placeholder.svg?height=50&width=50&text=Pocachip',
    price: 300,
    quantity: 40,
    inStockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1일 전
  },
  {
    id: 'prod-4',
    name: '새로운 음료',
    image: '/placeholder.svg?height=50&width=50&text=NewDrink',
    price: 250,
    quantity: 20,
    inStockDate: new Date() // 오늘
  },
  {
    id: 'prod-5',
    name: '오래된 과자',
    image: '/placeholder.svg?height=50&width=50&text=OldSnack',
    price: 100,
    quantity: 15,
    inStockDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10일 전
  }
];

let currentMockProducts: Product[] = [...initialMockProducts];

export const getMockProducts = () => [...currentMockProducts];

export const addMockProduct = (newProduct: Product) => {
  currentMockProducts.push(newProduct);
};
