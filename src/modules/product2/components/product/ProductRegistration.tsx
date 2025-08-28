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
import {
  getAvailableLocationsForProduct,
  assignProductToMockLocation
} from '@/modules/slot/api/helpers';
import type { Product } from '@/shared/lib/types';
import type { ProductRegistrationProps } from '../../lib/types';
import type { SuggestedLocation } from '@/modules/slot/lib/types';
import {
  addMockProduct,
  getMockProducts
} from '@/modules/product2/api/mock-data';
import { CATEGORIES } from '../../lib';

export function ProductRegistration({
  userRole,
  currentStore
}: ProductRegistrationProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    quantity: '',
    description: '',
    category: '',
    tags: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [inStockDate, setInStockDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState<
    SuggestedLocation[]
  >([]);
  const [registeredProduct, setRegisteredProduct] = useState<Product | null>(
    null
  );

  // 가격 입력 시 위치 추천
  useEffect(() => {
    if (formData.price && !isNaN(Number(formData.price))) {
      const price = Number(formData.price);
      const availableLocations = getAvailableLocationsForProduct(price);
      setSuggestedLocations(availableLocations);
    } else {
      setSuggestedLocations([]);
    }
  }, [formData.price]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        image: uploadedImage || '/placeholder.svg',
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        brand: formData.brand || undefined,
        description: formData.description || undefined,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : undefined,
        category: formData.category || undefined,
        status: 'registered',
        inStockDate: inStockDate,
        createdAt: new Date()
      };

      // Mock API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addMockProduct(newProduct);
      setRegisteredProduct(newProduct);

      toast({
        title: '상품 등록 완료',
        description: `${newProduct.name}이(가) 성공적으로 등록되었습니다.`
      });

      // 폼 초기화
      setFormData({
        name: '',
        price: '',
        brand: '',
        quantity: '',
        description: '',
        category: '',
        tags: ''
      });
      setUploadedImage(null);
      setInStockDate(new Date());
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '등록 실패',
        description: '상품 등록 중 오류가 발생했습니다.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationAssignment = (
    location: SuggestedLocation,
    product: Product
  ) => {
    const success = assignProductToMockLocation(
      location.id,
      product,
      product.quantity
    );

    if (success) {
      toast({
        title: '위치 배정 완료',
        description: `${product.name}이(가) ${location.parentName}의 ${location.layer} 층에 배정되었습니다.`
      });
      // 추천 위치 업데이트
      const availableLocations = getAvailableLocationsForProduct(product.price);
      setSuggestedLocations(availableLocations);
    } else {
      toast({
        variant: 'destructive',
        title: '배정 실패',
        description: '위치 배정 중 오류가 발생했습니다.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            상품 등록
          </CardTitle>
          <CardDescription>
            새로운 상품을 등록하고 위치를 배정하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">상품명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="상품명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">가격 *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="가격을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="brand">브랜드</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="브랜드를 입력하세요"
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">수량 *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange('quantity', e.target.value)
                    }
                    placeholder="수량을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange('category', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">태그</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="태그를 쉼표로 구분하여 입력"
                  />
                </div>

                <div>
                  <Label>입고일</Label>
                  <DatePicker date={inStockDate} setDate={setInStockDate} />
                </div>

                <div>
                  <Label htmlFor="image">상품 이미지</Label>
                  <div className="mt-2">
                    {uploadedImage ? (
                      <div className="relative inline-block">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="h-32 w-32 rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => setUploadedImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
                        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                        >
                          이미지를 선택하세요
                        </Label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '등록 중...' : '상품 등록'}
            </Button>
          </form>

          {/* 추천 위치 표시 */}
          {suggestedLocations.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                추천 위치 ({suggestedLocations.length}개)
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {suggestedLocations.map((location) => (
                  <Card key={location.id} className="border">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium">{location.parentName}</p>
                          <p className="text-sm text-gray-600">
                            {location.layer} 층
                          </p>
                        </div>
                        <Badge
                          variant={
                            location.reason === 'empty'
                              ? 'default'
                              : location.reason === 'old_stock'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {location.reason === 'empty'
                            ? '빈 위치'
                            : location.reason === 'old_stock'
                              ? '오래된 재고'
                              : '가격 일치'}
                        </Badge>
                      </div>
                      <div className="mb-3 text-xs text-gray-500">
                        <p>
                          위치: ({location.row}, {location.col})
                        </p>
                        <p>가격: {location.price}원</p>
                        <p>
                          수용량: {location.currentQuantity}/
                          {location.maxQuantity}
                        </p>
                      </div>
                      {registeredProduct && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleLocationAssignment(
                              location,
                              registeredProduct
                            )
                          }
                          className="w-full"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          배정
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
