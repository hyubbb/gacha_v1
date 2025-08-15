'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Package, Check, MapPin, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DatePicker } from '@/components/ui/date-picker'
import { getAvailableLocationsForProduct, assignProductToMockLocation } from '@/lib/slot-helpers' // getAvailableSlotsForProduct -> getAvailableLocationsForProduct, assignProductToMockSlot -> assignProductToMockLocation
import { Product, SuggestedLocation } from '@/lib/types' // SuggestedSlot -> SuggestedLocation
import { addMockProduct, getMockLocations } from '@/lib/mock-data' // getMockSlots -> getMockLocations

interface ProductRegistrationProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export default function ProductRegistration({ userRole, currentStore }: ProductRegistrationProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    quantity: '',
    description: '',
    category: '',
    tags: ''
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [inStockDate, setInStockDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedLocations, setSuggestedLocations] = useState<SuggestedLocation[]>([]) // suggestedSlots -> suggestedLocations
  const [registeredProduct, setRegisteredProduct] = useState<Product | null>(null)

  const categories = [
    '음료',
    '스낵',
    '아이스크림',
    '과자',
    '라면',
    '기타'
  ]

  // 가격 입력 시 위치 추천
  useEffect(() => {
    const price = parseInt(formData.price);
    if (!isNaN(price) && price > 0) {
      setSuggestedLocations(getAvailableLocationsForProduct(price)); // setSuggestedSlots -> setSuggestedLocations, getAvailableSlotsForProduct -> getAvailableLocationsForProduct
    } else {
      setSuggestedLocations([]); // setSuggestedSlots -> setSuggestedLocations
    }
  }, [formData.price]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !inStockDate) {
      toast({
        title: '입력 오류',
        description: '상품명, 가격, 입고일자는 필수 입력 항목입니다.',
        variant: 'destructive'
      })
      return
    }

    if (!uploadedImage && !formData.description) {
      toast({
        title: '입력 오류',
        description: '이미지 또는 설명 중 최소 1개는 입력해야 합니다.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        image: uploadedImage || '/placeholder.svg?height=200&width=200',
        price: parseInt(formData.price),
        brand: formData.brand,
        quantity: parseInt(formData.quantity || '0'),
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        category: formData.category,
        status: 'in_stock',
        createdAt: new Date(),
        inStockDate: inStockDate
      }

      addMockProduct(newProduct); // 모의 데이터에 상품 추가

      toast({
        title: '등록 완료',
        description: `${formData.name}이(가) 성공적으로 등록되었습니다.`,
      })

      setRegisteredProduct(newProduct); // 등록된 상품 정보 저장하여 위치 할당에 사용
      
      // 폼 초기화 (상품 등록 후 바로 위치 할당을 위해 일부 필드는 유지)
      setFormData({
        name: '',
        price: '',
        brand: '',
        quantity: '',
        description: '',
        category: '',
        tags: ''
      })
      setUploadedImage(null)
      setInStockDate(new Date())

    } catch (error) {
      toast({
        title: '등록 실패',
        description: '상품 등록 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignLocation = (location: SuggestedLocation) => { // handleAssignSlot -> handleAssignLocation, slot -> location
    if (!registeredProduct) {
      toast({
        title: '오류',
        description: '먼저 상품을 등록해주세요.',
        variant: 'destructive'
      });
      return;
    }

    const quantityToAssign = parseInt(formData.quantity || '0');
    if (isNaN(quantityToAssign) || quantityToAssign <= 0) {
      toast({
        title: '수량 오류',
        description: '유효한 수량을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    // 위치의 현재 수용 가능량 계산
    const availableCapacity = location.maxQuantity - location.currentQuantity; // slot -> location
    if (quantityToAssign > availableCapacity) {
      toast({
        title: '수량 초과',
        description: `위치에 ${availableCapacity}개까지만 추가할 수 있습니다.`, // 슬롯 -> 위치
        variant: 'destructive'
      });
      return;
    }

    // 실제 할당 시뮬레이션
    const success = assignProductToMockLocation(location.id, registeredProduct, quantityToAssign); // assignProductToMockSlot -> assignProductToMockLocation, slot -> location

    if (success) {
      toast({
        title: '위치 할당 완료', // 슬롯 할당 -> 위치 할당
        description: `${registeredProduct.name} ${quantityToAssign}개이(가) 위치 ${location.id}에 할당되었습니다. 위치 맵에서 확인하세요.`, // 슬롯 -> 위치, 슬롯 맵 -> 위치 맵
      });
      setRegisteredProduct(null); // 할당 후 등록된 상품 초기화
      setSuggestedLocations([]); // setSuggestedSlots -> setSuggestedLocations
      // 위치 맵 데이터 갱신을 위해 목업 데이터 새로고침 (실제에서는 API 호출)
      getMockLocations(); // getMockSlots -> getMockLocations
    } else {
      toast({
        title: '할당 실패',
        description: '위치 할당 중 오류가 발생했습니다.', // 슬롯 할당 -> 위치 할당
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>상품 등록</span>
          </CardTitle>
          <CardDescription>
            새로운 상품을 등록하고 재고를 관리합니다.
            {userRole === 'branch' && ` (${currentStore === 'store-001' ? '강남점' : currentStore === 'store-002' ? '홍대점' : '명동점'})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <Label>상품 이미지</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage || "/placeholder.svg"} 
                        alt="업로드된 이미지" 
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            이미지 업로드
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, GIF (최대 10MB)
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 상품 정보 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">상품명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="상품명을 입력하세요"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">가격 (원) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">수량</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brand">브랜드명</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="브랜드명을 입력하세요"
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
                  <Label htmlFor="in-stock-date">입고일자 *</Label>
                  <DatePicker
                    date={inStockDate}
                    setDate={setInStockDate}
                    placeholder="입고일자를 선택하세요"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="상품에 대한 상세 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 음료, 탄산, 콜라)"
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>등록 중...</>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    상품 등록
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 위치 추천 섹션 */}
      {suggestedLocations.length > 0 && registeredProduct && ( // suggestedSlots -> suggestedLocations
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>추천 위치 ({registeredProduct.price}원)</span> {/* 슬롯 -> 위치 */}
            </CardTitle>
            <CardDescription>
              등록된 상품을 배치할 수 있는 위치를 추천합니다. {/* 슬롯 -> 위치 */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedLocations.map((location) => ( // suggestedSlots -> suggestedLocations, slot -> location
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    location.reason === 'empty' ? 'border-blue-400 bg-blue-50' :
                    location.reason === 'old_stock' ? 'border-yellow-400 bg-yellow-50' : ''
                  }`}
                  onClick={() => handleAssignLocation(location)} // handleAssignSlot -> handleAssignLocation, slot -> location
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {location.parentName} - {location.layer === 'top' ? '상단' : location.layer === 'middle' ? '중단' : '하단'}층 ({location.id})
                          </span>
                          <Badge variant="outline">
                            {location.reason === 'empty' ? '빈 위치' : // 빈 슬롯 -> 빈 위치
                             location.reason === 'old_stock' ? '오래된 재고' : '가격 일치'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          위치 가격: {location.price}원 | 용량: {location.currentQuantity}/{location.maxQuantity} {/* 슬롯 가격 -> 위치 가격 */}
                        </p>
                        {location.product && (
                          <p className="text-xs text-yellow-700 mt-1">
                            현재 상품: {location.product.name} (입고일: {location.product.inStockDate?.toLocaleDateString()})
                          </p>
                        )}
                        {location.product && location.price !== location.product.price && (
                          <div className="flex items-center text-red-600 text-xs mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            <span>위치 가격({location.price}원)과 상품 가격({location.product.price}원)이 다릅니다!</span> {/* 슬롯 가격 -> 위치 가격 */}
                          </div>
                        )}
                      </div>
                      <Button size="sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        할당
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * 위치 할당은 시뮬레이션이며, 실제 반영을 위해서는 위치 맵 페이지를 새로고침해야 합니다. {/* 슬롯 할당 -> 위치 할당, 슬롯 맵 -> 위치 맵 */}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 등록 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle>등록 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 상품명, 가격, 입고일자는 필수 입력 항목입니다.</p>
            <p>• 이미지 또는 설명 중 최소 1개는 입력해야 합니다.</p>
            <p>• 등록된 상품은 '입고 완료' 상태로 저장됩니다.</p>
            <p>• 태그는 상품 검색 시 활용됩니다.</p>
            <p>• 가격은 위치 배치 시 자동 매칭에 사용됩니다.</p>
            <p>• 입고일자는 위치 맵에서 장기 재고를 표시하는 데 사용됩니다.</p>
            <p>• 상품 등록 후, 동일 가격의 빈 위치 또는 오래된 재고 위치가 추천됩니다.</p> {/* 슬롯 -> 위치 */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
