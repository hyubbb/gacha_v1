'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DatePicker } from '@/components/ui/date-picker'
import { Product, Slot } from '@/lib/types'
import { addMockProduct } from '@/lib/mock-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProductRegistrationAndAssignmentFormProps {
  location: Slot
  availableProducts: Product[]
  onComplete: (updatedLocation: Slot, isNew: boolean) => void
  onCancel: () => void
  isNew: boolean
}

const clampInt = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export default function ProductRegistrationAndAssignmentForm({
  location,
  availableProducts,
  onComplete,
  onCancel,
  isNew
}: ProductRegistrationAndAssignmentFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('assignExisting')

  // 새 상품 등록 상태
  const [newProductFormData, setNewProductFormData] = useState({
    name: '',
    price: '',
    brand: '',
    quantity: '',
    description: '',
    category: '',
    tags: ''
  })
  const [newProductImage, setNewProductImage] = useState<string | null>(null)
  const [newProductInStockDate, setNewProductInStockDate] = useState<Date | undefined>(new Date())
  const [isRegisteringNewProduct, setIsRegisteringNewProduct] = useState(false)

  // 기존 상품 할당 상태
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [quantityToAssign, setQuantityToAssign] = useState('0')
  const [isAssigningExistingProduct, setIsAssigningExistingProduct] = useState(false)

  const categories = ['음료', '스낵', '아이스크림', '과자', '라면', '기타']
  const maxCap = 30

  const selectedProductDetails = availableProducts.find(p => p.id === selectedProductId)

  const handleNewProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setNewProductImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleRegisterNewProductAndAssign = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProductFormData.name || !newProductFormData.price || !newProductInStockDate) {
      toast({ title: '입력 오류', description: '상품명, 가격, 입고일자는 필수입니다.', variant: 'destructive' })
      return
    }

    if (!newProductImage && !newProductFormData.description) {
      toast({ title: '입력 오류', description: '이미지 또는 설명 중 1개는 입력해야 합니다.', variant: 'destructive' })
      return
    }

    const quantity = parseInt(newProductFormData.quantity || '0')
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: '수량 오류', description: '유효한 수량을 입력해주세요.', variant: 'destructive' })
      return
    }

    const fixedMax = clampInt(location.maxQuantity || 0, 1, maxCap)
    if (quantity > fixedMax) {
      toast({ title: '수량 초과', description: `이 위치의 최대 수량은 ${fixedMax}개입니다.`, variant: 'destructive' })
      return
    }

    setIsRegisteringNewProduct(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 400))

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: newProductFormData.name,
        image: newProductImage || '/placeholder.svg?height=200&width=200',
        price: parseInt(newProductFormData.price),
        brand: newProductFormData.brand,
        quantity,
        description: newProductFormData.description,
        tags: newProductFormData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        category: newProductFormData.category,
        status: 'in_stock',
        createdAt: new Date(),
        inStockDate: newProductInStockDate
      }

      addMockProduct(newProduct)

      // 가격 불일치 처리: 위치 가격이 0이면 자동 초기화, 아니면 동일해야 함
      let finalPrice = location.price
      if (finalPrice === 0) {
        finalPrice = newProduct.price
      } else if (finalPrice !== newProduct.price) {
        toast({ title: '가격 불일치', description: '위치 가격과 상품 가격이 다릅니다. 위치 가격을 수정해주세요.', variant: 'destructive' })
        return
      }

      const updatedLocation: Slot = {
        ...location,
        id: isNew ? `${location.parentId}-${location.layer === 'top' ? '1' : location.layer === 'middle' ? '2' : '3'}` : location.id,
        price: finalPrice,
        maxQuantity: fixedMax,
        currentQuantity: quantity,
        product: {
          id: newProduct.id,
          name: newProduct.name,
          image: newProduct.image,
          price: newProduct.price,
          inStockDate: newProduct.inStockDate
        },
        status: 'active'
      }

      onComplete(updatedLocation, isNew)
    } catch {
      toast({ title: '오류', description: '상품 등록 및 할당 중 문제가 발생했습니다.', variant: 'destructive' })
    } finally {
      setIsRegisteringNewProduct(false)
    }
  }

  const handleAssignExistingProduct = async () => {
    if (!selectedProductId) {
      toast({ title: '상품 선택', description: '상품을 선택해주세요.', variant: 'destructive' })
      return
    }
    const productToAssign = availableProducts.find(p => p.id === selectedProductId)
    if (!productToAssign) {
      toast({ title: '상품 오류', description: '선택한 상품을 찾을 수 없습니다.', variant: 'destructive' })
      return
    }

    const quantity = parseInt(quantityToAssign || '0')
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: '수량 오류', description: '유효한 수량을 입력해주세요.', variant: 'destructive' })
      return
    }

    const fixedMax = clampInt(location.maxQuantity || 0, 1, maxCap)
    if (quantity > fixedMax) {
      toast({ title: '수량 초과', description: `이 위치의 최대 수량은 ${fixedMax}개입니다.`, variant: 'destructive' })
      return
    }

    // 가격 불일치 방지: 위치 가격 0이면 자동 설정, 아니면 동일해야 진행
    let finalPrice = location.price
    if (finalPrice === 0) {
      finalPrice = productToAssign.price
    } else if (finalPrice !== productToAssign.price) {
      toast({ title: '가격 불일치', description: '위치 가격과 상품 가격이 다릅니다. 위치 가격을 맞춰주세요.', variant: 'destructive' })
      return
    }

    setIsAssigningExistingProduct(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))

      const updatedLocation: Slot = {
        ...location,
        id: isNew ? `${location.parentId}-${location.layer === 'top' ? '1' : location.layer === 'middle' ? '2' : '3'}` : location.id,
        price: finalPrice,
        maxQuantity: fixedMax,
        currentQuantity: quantity,
        product: {
          id: productToAssign.id,
          name: productToAssign.name,
          image: productToAssign.image,
          price: productToAssign.price,
          inStockDate: new Date()
        },
        status: 'active'
      }

      onComplete(updatedLocation, isNew)
    } catch {
      toast({ title: '오류', description: '상품 할당 중 문제가 발생했습니다.', variant: 'destructive' })
    } finally {
      setIsAssigningExistingProduct(false)
    }
  }

  const fixedMaxCap = clampInt(location.maxQuantity || 0, 1, maxCap)

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
              <CardDescription>선택한 좌표에 기존 상품을 할당합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assign-select-product">상품 선택</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="assign-select-product">
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
              {selectedProductDetails && (
                <div className="flex items-center space-x-3 p-2 border rounded-md bg-blue-50">
                  <img src={selectedProductDetails.image || "/placeholder.svg"} alt={selectedProductDetails.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium">{selectedProductDetails.name}</p>
                    <p className="text-sm text-gray-500">가격: {selectedProductDetails.price}원</p>
                    <p className="text-sm text-gray-500">재고: {selectedProductDetails.quantity}개</p>
                    {selectedProductDetails.inStockDate && (
                      <p className="text-xs text-gray-400">입고일: {selectedProductDetails.inStockDate.toLocaleDateString()}</p>
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
                  min={1}
                  max={fixedMaxCap}
                />
                <p className="text-xs text-gray-500 mt-1">최대 {fixedMaxCap}개까지 할당 가능</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleAssignExistingProduct}
                  disabled={!selectedProductId || isNaN(parseInt(quantityToAssign)) || parseInt(quantityToAssign) <= 0 || parseInt(quantityToAssign) > fixedMaxCap || isAssigningExistingProduct}
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
              <CardDescription>새 상품을 등록하고 즉시 할당합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterNewProductAndAssign} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 이미지 업로드 */}
                  <div className="space-y-4">
                    <Label>상품 이미지</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {newProductImage ? (
                        <div className="relative">
                          <img
                            src={newProductImage || "/placeholder.svg"}
                            alt="업로드된 이미지"
                            className="w-full h-48 object-cover rounded"
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
                            <label htmlFor="new-image-upload" className="cursor-pointer">
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
                        onChange={(e) => setNewProductFormData({ ...newProductFormData, name: e.target.value })}
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
                          onChange={(e) => setNewProductFormData({ ...newProductFormData, price: e.target.value })}
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
                          onChange={(e) => setNewProductFormData({ ...newProductFormData, quantity: e.target.value })}
                          placeholder="0"
                          required
                          min={1}
                          max={maxCap}
                        />
                        <p className="text-xs text-gray-500 mt-1">최대 {maxCap}개까지 할당 가능</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-brand">브랜드명</Label>
                      <Input
                        id="new-brand"
                        value={newProductFormData.brand}
                        onChange={(e) => setNewProductFormData({ ...newProductFormData, brand: e.target.value })}
                        placeholder="브랜드명을 입력하세요"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-category">카테고리</Label>
                      <Select value={newProductFormData.category} onValueChange={(value) => setNewProductFormData({ ...newProductFormData, category: value })}>
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

                    {/* 입고일 */}
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
                    onChange={(e) => setNewProductFormData({ ...newProductFormData, description: e.target.value })}
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="new-tags">태그</Label>
                  <Input
                    id="new-tags"
                    value={newProductFormData.tags}
                    onChange={(e) => setNewProductFormData({ ...newProductFormData, tags: e.target.value })}
                    placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 음료, 탄산, 콜라)"
                  />
                  {newProductFormData.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
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
                    취소
                  </Button>
                  <Button type="submit" disabled={isRegisteringNewProduct}>
                    {isRegisteringNewProduct ? '등록 및 할당 중...' : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
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
  )
}
