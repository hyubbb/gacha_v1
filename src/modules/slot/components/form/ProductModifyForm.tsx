'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/shadcn/card';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/shadcn/select';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Check, X, Package, AlertCircle } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { DatePicker } from '@/shared/ui/shadcn/date-picker';
// import { updateMockLocation } from '@/lib/mock-data' // 직접 업데이트 제거

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/ui/shadcn/tabs';
import { ProductModifyFormProps, Slot } from '../../lib/types';

export const ProductModifyForm = ({
  location,
  availableProducts,
  onComplete,
  onCancel
}: ProductModifyFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('modifyCurrent');

  // State for modifying current product
  const [currentProductQuantity, setCurrentProductQuantity] = useState(
    location.currentQuantity.toString()
  );
  const [currentProductInStockDate, setCurrentProductInStockDate] = useState<
    Date | undefined
  >(location.product?.inStockDate || new Date());
  const [isModifying, setIsModifying] = useState(false);

  // State for replacing product
  const [replaceProductId, setReplaceProductId] = useState<string>('');
  const [replaceQuantity, setReplaceQuantity] = useState('0');
  const [isReplacing, setIsReplacing] = useState(false);

  const selectedReplaceProductDetails = availableProducts.find(
    (p) => p.id === replaceProductId
  );

  const handleModifyCurrentProduct = async () => {
    if (!location.product) {
      toast({
        title: '오류',
        description: '현재 할당된 상품이 없습니다.',
        variant: 'destructive'
      });
      return;
    }
    const quantity = parseInt(currentProductQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: '수량 오류',
        description: '유효한 수량을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }
    if (quantity > location.maxQuantity) {
      toast({
        title: '수량 초과',
        description: `위치 최대 수량 ${location.maxQuantity}개를 초과할 수 없습니다.`,
        variant: 'destructive'
      });
      return;
    }

    setIsModifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedLocation: Slot = {
        ...location,
        currentQuantity: quantity,
        product: {
          ...location.product,
          inStockDate: currentProductInStockDate || new Date()
        }
      };
      // updateMockLocation(updatedLocation); // 직접 업데이트 제거
      onComplete(updatedLocation); // 부모 컴포넌트로 업데이트된 위치 정보 전달
    } catch (error) {
      toast({
        title: '수정 실패',
        description: '상품 정보 수정 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsModifying(false);
    }
  };

  const handleReplaceProduct = async () => {
    if (!replaceProductId) {
      toast({
        title: '상품 선택 오류',
        description: '교체할 상품을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }
    const quantity = parseInt(replaceQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: '수량 오류',
        description: '유효한 수량을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }
    if (quantity > location.maxQuantity) {
      toast({
        title: '수량 초과',
        description: `위치 최대 수량 ${location.maxQuantity}개를 초과할 수 없습니다.`,
        variant: 'destructive'
      });
      return;
    }

    const productToReplace = availableProducts.find(
      (p) => p.id === replaceProductId
    );
    if (!productToReplace) {
      toast({
        title: '상품 선택 오류',
        description: '선택된 상품을 찾을 수 없습니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsReplacing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedLocation: Slot = {
        ...location,
        currentQuantity: quantity,
        product: {
          id: productToReplace.id,
          name: productToReplace.name,
          image: productToReplace.image,
          price: productToReplace.price,
          quantity: productToReplace.quantity,
          inStockDate: new Date() // New product, new in-stock date
        }
      };
      // updateMockLocation(updatedLocation); // 직접 업데이트 제거
      onComplete(updatedLocation); // 부모 컴포넌트로 업데이트된 위치 정보 전달
    } catch (error) {
      toast({
        title: '교체 실패',
        description: '상품 교체 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsReplacing(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!location.product) return;

    setIsModifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedLocation: Slot = {
        ...location,
        currentQuantity: 0,
        product: undefined
      };
      // updateMockLocation(updatedLocation); // 직접 업데이트 제거
      onComplete(updatedLocation); // 부모 컴포넌트로 업데이트된 위치 정보 전달 (상품 제거됨)
    } catch (error) {
      toast({
        title: '제거 실패',
        description: '상품 제거 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modifyCurrent" disabled={!location.product}>
            상품 정보 수정
          </TabsTrigger>
          <TabsTrigger value="replaceProduct">상품 교체</TabsTrigger>
        </TabsList>

        <TabsContent value="modifyCurrent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>현재 상품 정보 수정</CardTitle>
              <CardDescription>
                위치에 할당된 상품의 수량 및 입고일자를 수정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {location.product ? (
                <>
                  <div className="flex items-center space-x-3 rounded-md border bg-gray-50 p-2">
                    <img
                      src={location.product.image || '/placeholder.svg'}
                      alt={location.product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{location.product.name}</p>
                      <p className="text-sm text-gray-500">
                        상품 가격: {location.product.price}원
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="current-quantity">현재 수량</Label>
                    <Input
                      id="current-quantity"
                      type="number"
                      value={currentProductQuantity}
                      onChange={(e) =>
                        setCurrentProductQuantity(e.target.value)
                      }
                      placeholder="수량 입력"
                      min="0"
                      max={location.maxQuantity.toString()}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      최대 {location.maxQuantity}개까지 가능
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="current-in-stock-date">입고일자</Label>
                    <DatePicker
                      date={currentProductInStockDate}
                      setDate={setCurrentProductInStockDate}
                      placeholder="입고일자를 선택하세요"
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveProduct}
                      disabled={isModifying}
                    >
                      <X className="mr-1 h-4 w-4" /> 상품 제거
                    </Button>
                    <Button
                      type="button"
                      onClick={handleModifyCurrentProduct}
                      disabled={isModifying}
                    >
                      {isModifying ? '수정 중...' : '정보 수정'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  이 위치에는 할당된 상품이 없습니다. 상품 교체 탭을
                  이용해주세요.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replaceProduct" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>상품 교체</CardTitle>
              <CardDescription>
                위치에 할당된 상품을 다른 상품으로 교체합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="replace-select-product">교체할 상품 선택</Label>
                <Select
                  value={replaceProductId}
                  onValueChange={setReplaceProductId}
                >
                  <SelectTrigger id="replace-select-product">
                    <SelectValue placeholder="상품을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.price}원)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedReplaceProductDetails && (
                <div className="flex items-center space-x-3 rounded-md border bg-blue-50 p-2">
                  <img
                    src={
                      selectedReplaceProductDetails.image || '/placeholder.svg'
                    }
                    alt={selectedReplaceProductDetails.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {selectedReplaceProductDetails.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      가격: {selectedReplaceProductDetails.price}원
                    </p>
                    <p className="text-sm text-gray-500">
                      재고: {selectedReplaceProductDetails.quantity}개
                    </p>
                    {selectedReplaceProductDetails.inStockDate && (
                      <p className="text-xs text-gray-400">
                        입고일:{' '}
                        {selectedReplaceProductDetails.inStockDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="replace-quantity">수량</Label>
                <Input
                  id="replace-quantity"
                  type="number"
                  value={replaceQuantity}
                  onChange={(e) => setReplaceQuantity(e.target.value)}
                  placeholder="수량 입력"
                  min="1"
                  max={location.maxQuantity.toString()}
                />
                <p className="mt-1 text-xs text-gray-500">
                  최대 {location.maxQuantity}개까지 할당 가능
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  {' '}
                  {/* 취소 시 onCancel 호출 */}
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleReplaceProduct}
                  disabled={
                    !replaceProductId ||
                    isNaN(parseInt(replaceQuantity)) ||
                    parseInt(replaceQuantity) <= 0 ||
                    parseInt(replaceQuantity) > location.maxQuantity ||
                    isReplacing
                  }
                >
                  {isReplacing ? '교체 중...' : '상품 교체'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
