'use client';
import { EditLocationProps, Slot } from '../../lib/types';
import { useToast } from '@/shared/hooks/use-toast';
import { useState } from 'react';
import { Label } from '@/shared/ui/shadcn/label';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/shadcn/select';

import { clampInt } from '../../lib/utils';
import {
  Card,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared';
import { Edit } from 'lucide-react';
import { ProductModifyForm } from './ProductModifyForm';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../lib/constants';

// 위치 편집 폼

export const EditLocationForm = ({
  location,
  onSave,
  onCancel,
  onDelete,
  availableProducts
}: EditLocationProps) => {
  const { toast } = useToast();
  const [editPrice, setEditPrice] = useState(location.price.toString());
  const [editMaxQuantity, setEditMaxQuantity] = useState(
    location.maxQuantity.toString()
  );
  const [editStatus, setEditStatus] = useState(location.status);

  // 로컬 상품/수량
  const [localProduct, setLocalProduct] = useState(location.product);
  const [localCurrentQuantity, setLocalCurrentQuantity] = useState(
    location.currentQuantity.toString()
  );
  const [selectedProductIdForAssignment, setSelectedProductIdForAssignment] =
    useState<string>(location.product?.id || '');

  const [isProductModifyModalOpen, setIsProductModifyModalOpen] =
    useState(false);

  const selectedProductDetailsForAssignment = availableProducts.find(
    (p) => p.id === selectedProductIdForAssignment
  );

  // 상품 할당 (로컬 상태만)
  const handleAssignProductLocally = () => {
    const productToAssign = availableProducts.find(
      (p) => p.id === selectedProductIdForAssignment
    );
    const quantity = parseInt(localCurrentQuantity);

    if (!productToAssign) {
      toast({
        title: '상품 선택 오류',
        description: '상품을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: '수량 오류',
        description: '유효한 수량을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    const maxAllowed = clampInt(
      parseInt(editMaxQuantity) || 0,
      MIN_QUANTITY,
      MAX_QUANTITY
    );
    if (quantity > maxAllowed) {
      toast({
        title: '수량 초과',
        description: `최대 수량 ${maxAllowed}개를 초과할 수 없습니다.`,
        variant: 'destructive'
      });
      return;
    }

    // 가격 불일치 방지: 위치 가격 0이면 자동 초기화, 아니면 동일해야 함
    const locPrice = parseInt(editPrice) || 0;
    if (locPrice === 0) {
      setEditPrice(String(productToAssign.price));
    } else if (locPrice !== productToAssign.price) {
      toast({
        title: '가격 불일치',
        description:
          '위치 가격과 상품 가격이 다릅니다. 위치 가격을 맞춰주세요.',
        variant: 'destructive'
      });
      return;
    }

    setLocalProduct({
      id: productToAssign.id,
      name: productToAssign.name,
      image: productToAssign.image,
      price: productToAssign.price,
      inStockDate: new Date()
    });
    setLocalCurrentQuantity(quantity.toString());
    toast({
      title: '상품 할당 준비 완료',
      description: '위치 정보 저장 버튼을 눌러 변경사항을 확정하세요.'
    });
  };

  const handleProductModifyOrReplaceComplete = (
    updatedLocationFromModal?: Slot
  ) => {
    setIsProductModifyModalOpen(false);
    if (updatedLocationFromModal) {
      // 가격 불일치 방지: 위치 가격 0이면 새 가격으로 설정
      if (
        (parseInt(editPrice) || 0) === 0 &&
        updatedLocationFromModal.product
      ) {
        setEditPrice(String(updatedLocationFromModal.product.price));
      }
      setLocalProduct(updatedLocationFromModal.product);
      setLocalCurrentQuantity(
        updatedLocationFromModal.currentQuantity.toString()
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fixedMax = clampInt(
      parseInt(editMaxQuantity) || 0,
      MIN_QUANTITY,
      MAX_QUANTITY
    );
    const fixedPrice = Math.max(0, parseInt(editPrice) || 0);
    const qty = clampInt(parseInt(localCurrentQuantity) || 0, 0, fixedMax);

    onSave({
      ...location,
      price: fixedPrice,
      maxQuantity: fixedMax,
      status: editStatus,
      currentQuantity: qty,
      product: localProduct
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-price">위치 가격 (원)</Label>
          <Input
            id="edit-price"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            min={0}
            step={1}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-max-quantity">최대 수량 (최대 30)</Label>
          <Input
            id="edit-max-quantity"
            type="number"
            value={editMaxQuantity}
            onChange={(e) => setEditMaxQuantity(e.target.value)}
            min={1}
            max={30}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-status">상태</Label>
        <Select
          value={editStatus}
          onValueChange={(value: 'active' | 'inactive' | 'maintenance') =>
            setEditStatus(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="inactive">비활성</SelectItem>
            <SelectItem value="maintenance">점검중</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-dashed p-4">
        <CardTitle className="text-md mb-3">상품 할당/변경</CardTitle>
        {localProduct ? (
          <>
            <div className="mb-4 flex items-center space-x-3 rounded-md border bg-gray-50 p-2">
              <img
                src={localProduct.image || '/placeholder.svg'}
                alt={localProduct.name}
                className="h-12 w-12 rounded object-cover"
              />
              <div>
                <p className="font-medium">{localProduct.name}</p>
                <p className="text-sm text-gray-500">
                  현재 수량: {localCurrentQuantity}개
                </p>
                <p className="text-sm text-gray-500">
                  상품 가격: {localProduct.price}원
                </p>
                {localProduct.inStockDate && (
                  <p className="text-xs text-gray-400">
                    입고일: {localProduct.inStockDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setIsProductModifyModalOpen(true)}
              >
                <Edit className="mr-1 h-4 w-4" /> 수정
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="select-product">상품 선택</Label>
              <Select
                value={selectedProductIdForAssignment}
                onValueChange={setSelectedProductIdForAssignment}
              >
                <SelectTrigger id="select-product">
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
            {selectedProductDetailsForAssignment && (
              <div className="flex items-center space-x-3 rounded-md border bg-blue-50 p-2">
                <img
                  src={
                    selectedProductDetailsForAssignment.image ||
                    '/placeholder.svg'
                  }
                  alt={selectedProductDetailsForAssignment.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">
                    {selectedProductDetailsForAssignment.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    가격: {selectedProductDetailsForAssignment.price}원
                  </p>
                  <p className="text-sm text-gray-500">
                    재고: {selectedProductDetailsForAssignment.quantity}개
                  </p>
                  {selectedProductDetailsForAssignment.inStockDate && (
                    <p className="text-xs text-gray-400">
                      입고일:{' '}
                      {selectedProductDetailsForAssignment.inStockDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="quantity-to-add">수량</Label>
              <Input
                id="quantity-to-add"
                type="number"
                value={localCurrentQuantity}
                onChange={(e) => setLocalCurrentQuantity(e.target.value)}
                placeholder="수량 입력"
                min={0}
                max={30}
              />
              <p className="mt-1 text-xs text-gray-500">
                최대 {Math.min(parseInt(editMaxQuantity) || 0, MAX_QUANTITY)}
                개까지 가능
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleAssignProductLocally}
                disabled={
                  !selectedProductIdForAssignment ||
                  isNaN(parseInt(localCurrentQuantity)) ||
                  parseInt(localCurrentQuantity) >
                    clampInt(
                      parseInt(editMaxQuantity) || 0,
                      MIN_QUANTITY,
                      MAX_QUANTITY
                    )
                }
              >
                상품 할당
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            if (confirm('정말 이 위치를 삭제하시겠습니까?'))
              onDelete(location.id);
          }}
        >
          위치 삭제
        </Button>
        <Button type="submit">위치 정보 저장</Button>
      </div>

      {isProductModifyModalOpen && (
        <Dialog
          open={isProductModifyModalOpen}
          onOpenChange={setIsProductModifyModalOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>상품 정보 수정 / 교체</DialogTitle>
              <DialogDescription>
                좌표 {location.row},{location.col}에 할당된 상품 정보를
                수정/교체합니다.
              </DialogDescription>
            </DialogHeader>
            <ProductModifyForm
              location={{
                ...location,
                product: localProduct,
                currentQuantity: parseInt(localCurrentQuantity) || 0
              }}
              availableProducts={availableProducts}
              onComplete={handleProductModifyOrReplaceComplete}
              onCancel={() => setIsProductModifyModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
};
