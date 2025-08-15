'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Lightbulb, Check, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DisplayRegistrationProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

interface Product {
  id: string
  name: string
  image: string
  price: number
  brand: string
  quantity: number
}

interface Slot { // Slot interface name remains Slot for consistency, but referred to as 'Location' in UI/variables
  id: string
  row: number
  col: number
  layer: 'top' | 'middle' | 'bottom'
  price: number
  maxQuantity: number
  currentQuantity: number
  status: 'active' | 'inactive'
  isEmpty: boolean
}

interface RecommendedLocation extends Slot { // RecommendedSlot -> RecommendedLocation
  reason: string
  priority: number
}

export default function DisplayRegistration({ userRole, currentStore }: DisplayRegistrationProps) {
  const { toast } = useToast()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [displayType, setDisplayType] = useState<'normal' | 'stock' | 'sold_out'>('normal')
  const [selectedLocation, setSelectedLocation] = useState<Slot | null>(null) // selectedSlot -> selectedLocation
  const [displayQuantity, setDisplayQuantity] = useState('')
  const [useRecommendation, setUseRecommendation] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 샘플 상품 데이터
  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      name: '코카콜라 500ml',
      image: '/placeholder.svg?height=100&width=100',
      price: 200,
      brand: '코카콜라',
      quantity: 50
    },
    {
      id: 'prod-2',
      name: '펩시콜라 500ml',
      image: '/placeholder.svg?height=100&width=100',
      price: 200,
      brand: '펩시',
      quantity: 30
    },
    {
      id: 'prod-3',
      name: '포카칩 오리지널',
      image: '/placeholder.svg?height=100&width=100',
      price: 300,
      brand: '오리온',
      quantity: 40
    }
  ]

  // 추천 위치 생성 (가격 매칭 기준)
  const getRecommendedLocations = (product: Product): RecommendedLocation[] => { // getRecommendedSlots -> getRecommendedLocations, RecommendedSlot -> RecommendedLocation
    const allLocations: Slot[] = [ // allSlots -> allLocations
      { id: 'slot-1', row: 2, col: 3, layer: 'middle', price: 200, maxQuantity: 10, currentQuantity: 0, status: 'active', isEmpty: true },
      { id: 'slot-2', row: 2, col: 4, layer: 'middle', price: 200, maxQuantity: 10, currentQuantity: 5, status: 'active', isEmpty: false },
      { id: 'slot-3', row: 3, col: 5, layer: 'middle', price: 300, maxQuantity: 8, currentQuantity: 0, status: 'active', isEmpty: true },
      { id: 'slot-4', row: 1, col: 2, layer: 'top', price: 200, maxQuantity: 12, currentQuantity: 0, status: 'active', isEmpty: true },
      { id: 'slot-5', row: 4, col: 6, layer: 'bottom', price: 200, maxQuantity: 15, currentQuantity: 8, status: 'active', isEmpty: false }
    ]

    return allLocations // allSlots -> allLocations
      .filter(location => location.price === product.price && location.status === 'active') // slot -> location
      .map(location => ({ // slot -> location
        ...location, // slot -> location
        reason: location.isEmpty ? '빈 위치 (우선 추천)' : '부분 사용 중', // 빈 슬롯 -> 빈 위치
        priority: location.isEmpty ? 1 : 2
      }))
      .sort((a, b) => a.priority - b.priority)
  }

  const recommendedLocations = selectedProduct ? getRecommendedLocations(selectedProduct) : [] // recommendedSlots -> recommendedLocations, getRecommendedSlots -> getRecommendedLocations

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedLocation || !displayQuantity) { // selectedSlot -> selectedLocation
      toast({
        title: '입력 오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    const quantity = parseInt(displayQuantity)
    if (quantity > selectedProduct.quantity) {
      toast({
        title: '수량 오류',
        description: '전시 수량이 재고 수량을 초과할 수 없습니다.',
        variant: 'destructive'
      })
      return
    }

    if (quantity > selectedLocation.maxQuantity - selectedLocation.currentQuantity) { // selectedSlot -> selectedLocation
      toast({
        title: '위치 용량 오류', // 슬롯 용량 -> 위치 용량
        description: '위치의 최대 수용량을 초과할 수 없습니다.', // 슬롯 -> 위치
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: '전시 등록 완료',
        description: `${selectedProduct.name}이(가) 위치 (${selectedLocation.row}, ${selectedLocation.col})에 등록되었습니다.`, // 슬롯 -> 위치
      })

      // 폼 초기화
      setSelectedProduct(null)
      setSelectedLocation(null) // setSelectedSlot -> setSelectedLocation
      setDisplayQuantity('')
      setDisplayType('normal')

    } catch (error) {
      toast({
        title: '등록 실패',
        description: '전시 등록 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>전시 등록</span>
          </CardTitle>
          <CardDescription>
            상품을 선택하고 전시 위치를 지정합니다. {/* 슬롯 -> 위치 */}
            {userRole === 'branch' && ` (${currentStore === 'store-001' ? '강남점' : currentStore === 'store-002' ? '홍대점' : '명동점'})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 상품 선택 */}
          <div>
            <Label>상품 선택</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {sampleProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`cursor-pointer transition-all ${
                    selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-blue-600">{product.price}원</span>
                          <span className="text-sm text-gray-500">재고: {product.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 전시 타입 선택 */}
          <div>
            <Label>전시 타입</Label>
            <RadioGroup value={displayType} onValueChange={(value: 'normal' | 'stock' | 'sold_out') => setDisplayType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">일반 전시</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stock" id="stock" />
                <Label htmlFor="stock">재고 보관</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sold_out" id="sold_out" />
                <Label htmlFor="sold_out">품절 표시</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 자동 추천 사용 여부 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-recommendation"
              checked={useRecommendation}
              onChange={(e) => setUseRecommendation(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="use-recommendation">자동 위치 추천 사용</Label> {/* 자동 슬롯 추천 -> 자동 위치 추천 */}
          </div>

          {/* 추천 위치 또는 수동 선택 */}
          {selectedProduct && (
            <div>
              <Label>위치 선택</Label> {/* 슬롯 선택 -> 위치 선택 */}
              {useRecommendation && recommendedLocations.length > 0 ? ( // recommendedSlots -> recommendedLocations
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">추천 위치 ({recommendedLocations.length}개)</span> {/* 추천 슬롯 -> 추천 위치 */}
                  </div>
                  <div className="space-y-2">
                    {recommendedLocations.map((location) => ( // recommendedSlots -> recommendedLocations, slot -> location
                      <Card 
                        key={location.id}
                        className={`cursor-pointer transition-all ${
                          selectedLocation?.id === location.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md' // selectedSlot -> selectedLocation
                        }`}
                        onClick={() => setSelectedLocation(location)} // setSelectedSlot -> setSelectedLocation
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  위치: ({location.row}, {location.col}) - {location.layer === 'top' ? '상단' : location.layer === 'middle' ? '중단' : '하단'}층
                                </span>
                                <Badge variant={location.priority === 1 ? 'default' : 'secondary'}>
                                  {location.reason}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                가격: {location.price}원 | 용량: {location.currentQuantity}/{location.maxQuantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-500">
                                사용 가능: {location.maxQuantity - location.currentQuantity}개
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : useRecommendation && recommendedLocations.length === 0 ? ( // recommendedSlots -> recommendedLocations
                <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      가격이 {selectedProduct.price}원인 사용 가능한 위치가 없습니다. 수동으로 선택해주세요. {/* 슬롯 -> 위치 */}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Select onValueChange={(value) => {
                    const location = sampleProducts.find(() => true) // 실제로는 위치 데이터에서 찾기 // slot -> location
                    setSelectedLocation({ // setSelectedSlot -> setSelectedLocation
                      id: value,
                      row: 1,
                      col: 1,
                      layer: 'middle',
                      price: 200,
                      maxQuantity: 10,
                      currentQuantity: 0,
                      status: 'active',
                      isEmpty: true
                    })
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="위치를 선택하세요" /> {/* 슬롯 -> 위치 */}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual-1">위치 (1,1) - 중단층</SelectItem>
                      <SelectItem value="manual-2">위치 (1,2) - 상단층</SelectItem>
                      <SelectItem value="manual-3">위치 (2,1) - 하단층</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* 전시 수량 입력 */}
          {selectedProduct && selectedLocation && ( // selectedSlot -> selectedLocation
            <div>
              <Label htmlFor="display-quantity">전시 수량</Label>
              <Input
                id="display-quantity"
                type="number"
                value={displayQuantity}
                onChange={(e) => setDisplayQuantity(e.target.value)}
                placeholder="전시할 수량을 입력하세요"
                max={Math.min(
                  selectedProduct.quantity,
                  selectedLocation.maxQuantity - selectedLocation.currentQuantity // selectedSlot -> selectedLocation
                )}
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                최대 {Math.min(selectedProduct.quantity, selectedLocation.maxQuantity - selectedLocation.currentQuantity)}개까지 입력 가능 {/* selectedSlot -> selectedLocation */}
              </p>
            </div>
          )}

          {/* 등록 버튼 */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedProduct || !selectedLocation || !displayQuantity || isSubmitting} // selectedSlot -> selectedLocation
            >
              {isSubmitting ? (
                <>등록 중...</>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  전시 등록
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 등록 가이드 */}
      <Card>
        <CardHeader>
          <CardTitle>전시 등록 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 상품 가격과 위치 가격이 일치하는 경우 자동 추천됩니다.</p> {/* 슬롯 가격 -> 위치 가격 */}
            <p>• 빈 위치가 우선적으로 추천되며, 입고일이 오래된 순서로 정렬됩니다.</p> {/* 빈 슬롯 -> 빈 위치 */}
            <p>• 전시 수량은 재고 수량과 위치 용량을 초과할 수 없습니다.</p> {/* 슬롯 용량 -> 위치 용량 */}
            <p>• 전시 완료 후 위치-상품 연결 정보가 자동으로 저장됩니다.</p> {/* 슬롯-상품 -> 위치-상품 */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
