'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DatePicker } from '@/components/ui/date-picker'
import { Product, Slot } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProductModifyOrReplaceFormProps {
  location: Slot
  availableProducts: Product[]
  onComplete: (updatedLocation?: Slot) => void
  onCancel: () => void
}

export default function ProductModifyOrReplaceForm({ location, availableProducts, onComplete, onCancel }: ProductModifyOrReplaceFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('modifyCurrent')

  // 현재 상품 수정
  const [currentProductQuantity, setCurrentProductQuantity] = useState(location.currentQuantity.toString())
  const [currentProductInStockDate, setCurrentProductInStockDate] = useState<Date | undefined>(location.product?.inStockDate || new Date())
  const [isModifying, setIsModifying] = useState(false)

  // 상품 교체
  const [replaceProductId, setReplaceProductId] = useState<string>('')
  const [replaceQuantity, setReplaceQuantity] = useState('0')
  const [isReplacing, setIsReplacing] = useState(false)

  const selectedReplaceProductDetails = availableProducts.find(p => p.id === replaceProductId)
  const maxCap = 30

  const handleModifyCurrentProduct = async () => {
    if (!location.product) {
      toast({ title: '오류', description: '현재 할당된 상품이 없습니다.', variant: 'destructive' })
      return
    }
    const quantity = parseInt(currentProductQuantity)
    if (isNaN(quantity) || quantity < 0) {
      toast({ title: '수량 오류', description: '유효한 수량을 입력해주세요.', variant: 'destructive' })
      return
    }
    if (quantity > Math.min(location.maxQuantity, maxCap)) {
      toast({ title: '수량 초과', description: `최대 ${Math.min(location.maxQuantity, maxCap)}개까지 가능합니다.`, variant: 'destructive' })
      return
    }

    setIsModifying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const updatedLocation: Slot = {
        ...location,
        currentQuantity: quantity,
        product: {
          ...location.product,
          inStockDate: currentProductInStockDate || new Date()
        }
      }
      onComplete(updatedLocation)
    } catch {
      toast({ title: '수정 실패', description: '상품 정보 수정 중 오류가 발생했습니다.', variant: 'destructive' })
    } finally {
      setIsModifying(false)
    }
  }

  const handleReplaceProduct = async () => {
    if (!replaceProductId) {
      toast({ title: '상품 선택 오류', description: '교체할 상품을 선택해주세요.', variant: 'destructive' })
      return
    }
    const quantity = parseInt(replaceQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: '수량 오류', description: '유효한 수량을 입력해주세요.', variant: 'destructive' })
      return
    }
    if (quantity > Math.min(location.maxQuantity, maxCap)) {
      toast({ title: '수량 초과', description: `최대 ${Math.min(location.maxQuantity, maxCap)}개까지 가능합니다.`, variant: 'destructive' })
      return
    }

    const productToReplace = availableProducts.find(p => p.id === replaceProductId)
    if (!productToReplace) {
      toast({ title: '상품 선택 오류', description: '선택된 상품을 찾을 수 없습니다.', variant: 'destructive' })
      return
    }

    // 가격 불일치 방지: 위치 가격은 교체 상품과 동일해야 함 (0인 상황은 위치 편집에서 처리)
    if (location.price !== 0 && location.price !== productToReplace.price) {
      toast({ title: '가격 불일치', description: '위치 가격과 교체 상품 가격이 다릅니다. 위치 가격을 맞춰주세요.', variant: 'destructive' })
      return
    }

    setIsReplacing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const updatedLocation: Slot = {
        ...location,
        // 위치 가격이 0이면 교체하는 상품 가격으로 초기화
        price: location.price === 0 ? productToReplace.price : location.price,
        currentQuantity: quantity,
        product: {
          id: productToReplace.id,
          name: productToReplace.name,
          image: productToReplace.image,
          price: productToReplace.price,
          inStockDate: new Date()
        }
      }
      onComplete(updatedLocation)
    } catch {
      toast({ title: '교체 실패', description: '상품 교체 중 오류가 발생했습니다.', variant: 'destructive' })
    } finally {
      setIsReplacing(false)
    }
  }

  const handleRemoveProduct = async () => {
    if (!location.product) return
    setIsModifying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const updatedLocation: Slot = {
        ...location,
        currentQuantity: 0,
        product: undefined
      }
      onComplete(updatedLocation)
    } catch {
      toast({ title: '제거 실패', description: '상품 제거 중 오류가 발생했습니다.', variant: 'destructive' })
    } finally {
      setIsModifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modifyCurrent" disabled={!location.product}>상품 정보 수정</TabsTrigger>
          <TabsTrigger value="replaceProduct">상품 교체</TabsTrigger>
        </TabsList>

        <TabsContent value="modifyCurrent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>현재 상품 정보 수정</CardTitle>
              <CardDescription>수량과 입고일자를 수정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {location.product ? (
                <>
                  <div className="flex items-center space-x-3 p-2 border rounded-md bg-gray-50">
                    <img src={location.product.image || "/placeholder.svg"} alt={location.product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium">{location.product.name}</p>
                      <p className="text-sm text-gray-500">상품 가격: {location.product.price}원</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="current-quantity">현재 수량</Label>
                    <Input
                      id="current-quantity"
                      type="number"
                      value={currentProductQuantity}
                      onChange={(e) => setCurrentProductQuantity(e.target.value)}
                      placeholder="수량 입력"
                      min={0}
                      max={Math.min(location.maxQuantity, maxCap)}
                    />
                    <p className="text-xs text-gray-500 mt-1">최대 {Math.min(location.maxQuantity, maxCap)}개까지 가능</p>
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
                    <Button type="button" variant="destructive" onClick={handleRemoveProduct} disabled={isModifying}>
                      <X className="h-4 w-4 mr-1" /> 상품 제거
                    </Button>
                    <Button type="button" onClick={handleModifyCurrentProduct} disabled={isModifying}>
                      {isModifying ? '수정 중...' : '정보 수정'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">이 위치에는 할당된 상품이 없습니다. 상품 교체 탭을 이용해주세요.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replaceProduct" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>상품 교체</CardTitle>
              <CardDescription>다른 상품으로 교체합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="replace-select-product">교체할 상품 선택</Label>
                <Select value={replaceProductId} onValueChange={setReplaceProductId}>
                  <SelectTrigger id="replace-select-product">
                    <SelectValue placeholder="상품을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.price}원)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedReplaceProductDetails && (
                <div className="flex items-center space-x-3 p-2 border rounded-md bg-blue-50">
                  <img src={selectedReplaceProductDetails.image || "/placeholder.svg"} alt={selectedReplaceProductDetails.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium">{selectedReplaceProductDetails.name}</p>
                    <p className="text-sm text-gray-500">가격: {selectedReplaceProductDetails.price}원</p>
                    <p className="text-sm text-gray-500">재고: {selectedReplaceProductDetails.quantity}개</p>
                    {selectedReplaceProductDetails.inStockDate && (
                      <p className="text-xs text-gray-400">입고일: {selectedReplaceProductDetails.inStockDate.toLocaleDateString()}</p>
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
                  min={1}
                  max={Math.min(location.maxQuantity, maxCap)}
                />
                <p className="text-xs text-gray-500 mt-1">최대 {Math.min(location.maxQuantity, maxCap)}개까지 가능</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleReplaceProduct}
                  disabled={
                    !replaceProductId ||
                    isNaN(parseInt(replaceQuantity)) ||
                    parseInt(replaceQuantity) <= 0 ||
                    parseInt(replaceQuantity) > Math.min(location.maxQuantity, maxCap) ||
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
  )
}
