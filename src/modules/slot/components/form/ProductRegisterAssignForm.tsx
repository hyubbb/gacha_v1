'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/shared/ui/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/shadcn/select';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Upload, X, Package, Check, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { DatePicker } from '@/shared/ui/shadcn/date-picker';
import type {
  Product,
  Slot,
  ProductRegisterFormProps
} from '@/modules/slot/lib';
// import { addMockProduct, getMockProducts } from '../model/api/mock-data'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/ui/shadcn/tabs';
import { addMockProduct } from '@/modules/product2/api';

export const ProductRegisterAssignForm = ({
  location,
  availableProducts,
  onComplete,
  onCancel, // onCancel prop 추가
  isNew
}: ProductRegisterFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('assignExisting');

  // State for new product registration
  const [newProductFormData, setNewProductFormData] = useState({
    name: '',
    price: '',
    brand: '',
    quantity: '',
    description: '',
    category: '',
    tags: ''
  });
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [newProductInStockDate, setNewProductInStockDate] = useState<
    Date | undefined
  >(new Date());
  const [isRegisteringNewProduct, setIsRegisteringNewProduct] = useState(false);

  // State for existing product assignment
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantityToAssign, setQuantityToAssign] = useState('0');
  const [isAssigningExistingProduct, setIsAssigningExistingProduct] =
    useState(false);

  const categories = ['음료', '스낵', '아이스크림', '과자', '라면', '기타'];

  const selectedProductDetails = availableProducts.find(
    (p) => p.id === selectedProductId
  );

  const handleNewProductImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProductImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterNewProductAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProductFormData.name ||
      !newProductFormData.price ||
      !newProductInStockDate
    ) {
      toast({
        title: '입력 오류',
        description: '상품명, 가격, 입고일자는 필수 입력 항목입니다.',
        variant: 'destructive'
      });
      return;
    }

    if (!newProductImage && !newProductFormData.description) {
      toast({
        title: '입력 오류',
        description: '이미지 또는 설명 중 최소 1개는 입력해야 합니다.',
        variant: 'destructive'
      });
      return;
    }

    const quantity = parseInt(newProductFormData.quantity || '0');
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

    setIsRegisteringNewProduct(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: newProductFormData.name,
        image: newProductImage || '/placeholder.svg?height=200&width=200',
        price: parseInt(newProductFormData.price),
        brand: newProductFormData.brand,
        quantity: quantity, // Initial quantity for the product
        description: newProductFormData.description,
        tags: newProductFormData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: newProductFormData.category,
        inStockDate: newProductInStockDate
      };

      addMockProduct(newProduct); // 모의 데이터에 상품 추가

      const updatedLocation: Slot = {
        ...location,
        id: isNew
          ? `${location.parentId}-${location.layer === 'top' ? '1' : location.layer === 'middle' ? '2' : '3'}`
          : location.id, // 새로운 위치인 경우 실제 ID 할당
        currentQuantity: quantity,
        product: {
          id: newProduct.id,
          name: newProduct.name,
          image: newProduct.image,
          price: newProduct.price,
          inStockDate: newProduct.inStockDate || new Date(),
          quantity: newProduct.quantity
        },
        status: 'active'
      };

      onComplete(updatedLocation, isNew); // 부모 컴포넌트로 업데이트된 위치 정보와 isNew 상태 전달
    } catch (error) {
      toast({
        title: '등록 실패',
        description: '상품 등록 및 할당 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsRegisteringNewProduct(false);
    }
  };

  const handleAssignExistingProduct = async () => {
    if (!selectedProductId) {
      toast({
        title: '상품 선택 오류',
        description: '상품을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }
    const quantity = parseInt(quantityToAssign);
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

    const productToAssign = availableProducts.find(
      (p) => p.id === selectedProductId
    );
    if (!productToAssign) {
      toast({
        title: '상품 선택 오류',
        description: '선택된 상품을 찾을 수 없습니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsAssigningExistingProduct(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const updatedLocation: Slot = {
        ...location,
        id: isNew
          ? `${location.parentId}-${location.layer === 'top' ? '1' : location.layer === 'middle' ? '2' : '3'}`
          : location.id, // 새로운 위치인 경우 실제 ID 할당
        currentQuantity: quantity,
        product: {
          id: productToAssign.id,
          name: productToAssign.name,
          image: productToAssign.image,
          price: productToAssign.price,
          inStockDate: new Date(),
          quantity: productToAssign.quantity
        },
        status: 'active'
      };

      onComplete(updatedLocation, isNew); // 부모 컴포넌트로 업데이트된 위치 정보와 isNew 상태 전달
    } catch (error) {
      toast({
        title: '할당 실패',
        description: '상품 할당 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsAssigningExistingProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignExisting">기존 상품 할당</TabsTrigger>
          <TabsTrigger value="registerNew">새 상품 등록 및 할당</TabsTrigger>
        </TabsList>

        <TabsContent value="assignExisting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기존 상품 할당</CardTitle>
              <CardDescription>
                기존에 등록된 상품을 위치에 할당합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assign-select-product">상품 선택</Label>
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger id="assign-select-product">
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
              {selectedProductDetails && (
                <div className="flex items-center space-x-3 rounded-md border bg-blue-50 p-2">
                  <img
                    src={selectedProductDetails.image || '/placeholder.svg'}
                    alt={selectedProductDetails.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedProductDetails.name}</p>
                    <p className="text-sm text-gray-500">
                      가격: {selectedProductDetails.price}원
                    </p>
                    <p className="text-sm text-gray-500">
                      재고: {selectedProductDetails.quantity}개
                    </p>
                    {selectedProductDetails.inStockDate && (
                      <p className="text-xs text-gray-400">
                        입고일:{' '}
                        {selectedProductDetails.inStockDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="assign-quantity">수량</Label>
                <Input
                  id="assign-quantity"
                  type="number"
                  value={quantityToAssign}
                  onChange={(e) => setQuantityToAssign(e.target.value)}
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
                  onClick={handleAssignExistingProduct}
                  disabled={
                    !selectedProductId ||
                    isNaN(parseInt(quantityToAssign)) ||
                    parseInt(quantityToAssign) <= 0 ||
                    parseInt(quantityToAssign) > location.maxQuantity ||
                    isAssigningExistingProduct
                  }
                >
                  {isAssigningExistingProduct ? '할당 중...' : '상품 할당'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registerNew" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>새 상품 등록 및 할당</CardTitle>
              <CardDescription>
                새로운 상품을 등록하고 바로 위치에 할당합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleRegisterNewProductAndAssign}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* 이미지 업로드 */}
                  <div className="space-y-4">
                    <Label>상품 이미지</Label>
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                      {newProductImage ? (
                        <div className="relative">
                          <img
                            src={newProductImage || '/placeholder.svg'}
                            alt="업로드된 이미지"
                            className="h-48 w-full rounded object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setNewProductImage(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <label
                              htmlFor="new-image-upload"
                              className="cursor-pointer"
                            >
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                이미지 업로드
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                PNG, JPG, GIF (최대 10MB)
                              </span>
                            </label>
                            <input
                              id="new-image-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleNewProductImageUpload}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 상품 정보 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-name">상품명 *</Label>
                      <Input
                        id="new-name"
                        value={newProductFormData.name}
                        onChange={(e) =>
                          setNewProductFormData({
                            ...newProductFormData,
                            name: e.target.value
                          })
                        }
                        placeholder="상품명을 입력하세요"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-price">가격 (원) *</Label>
                        <Input
                          id="new-price"
                          type="number"
                          value={newProductFormData.price}
                          onChange={(e) =>
                            setNewProductFormData({
                              ...newProductFormData,
                              price: e.target.value
                            })
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-quantity">수량 *</Label>
                        <Input
                          id="new-quantity"
                          type="number"
                          value={newProductFormData.quantity}
                          onChange={(e) =>
                            setNewProductFormData({
                              ...newProductFormData,
                              quantity: e.target.value
                            })
                          }
                          placeholder="0"
                          required
                          max={location.maxQuantity.toString()}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          최대 {location.maxQuantity}개까지 할당 가능
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-brand">브랜드명</Label>
                      <Input
                        id="new-brand"
                        value={newProductFormData.brand}
                        onChange={(e) =>
                          setNewProductFormData({
                            ...newProductFormData,
                            brand: e.target.value
                          })
                        }
                        placeholder="브랜드명을 입력하세요"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-category">카테고리</Label>
                      <Select
                        value={newProductFormData.category}
                        onValueChange={(value) =>
                          setNewProductFormData({
                            ...newProductFormData,
                            category: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 입고일자 선택 */}
                    <div>
                      <Label htmlFor="new-in-stock-date">입고일자 *</Label>
                      <DatePicker
                        date={newProductInStockDate}
                        setDate={setNewProductInStockDate}
                        placeholder="입고일자를 선택하세요"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-description">상품 설명</Label>
                  <Textarea
                    id="new-description"
                    value={newProductFormData.description}
                    onChange={(e) =>
                      setNewProductFormData({
                        ...newProductFormData,
                        description: e.target.value
                      })
                    }
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="new-tags">태그</Label>
                  <Input
                    id="new-tags"
                    value={newProductFormData.tags}
                    onChange={(e) =>
                      setNewProductFormData({
                        ...newProductFormData,
                        tags: e.target.value
                      })
                    }
                    placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 음료, 탄산, 콜라)"
                  />
                  {newProductFormData.tags && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newProductFormData.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    {' '}
                    {/* 취소 시 onCancel 호출 */}
                    취소
                  </Button>
                  <Button type="submit" disabled={isRegisteringNewProduct}>
                    {isRegisteringNewProduct ? (
                      <>등록 및 할당 중...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        등록 및 할당
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
