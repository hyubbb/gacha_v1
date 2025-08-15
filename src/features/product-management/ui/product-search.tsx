'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Search, Filter, Edit, Trash2, Package, MapPin, Calendar, AlertCircle } from 'lucide-react'
import { useToast } from '@/shared/hooks/use-toast'
import { getMockProducts } from '@/entities/product/api'
import { getMockLocations } from '@/entities/slot/api'
import { Product } from '@/entities/product/model'
import { Slot } from '@/entities/slot/model'
import { Label } from '@/shared/ui/label'

interface ProductSearchProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export function ProductSearch({ userRole, currentStore }: ProductSearchProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [products, setProducts] = useState<Product[]>(getMockProducts())
  const [locations, setLocations] = useState<Slot[]>(getMockLocations())

  const categories = [
    '음료',
    '스낵',
    '아이스크림',
    '과자',
    '라면',
    '기타'
  ]

  const statuses = [
    'registered',
    'in_stock',
    'displayed'
  ]

  // 검색 및 필터링된 상품 목록
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    
    const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseInt(priceRange.max))
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice
  })

  // 정렬된 상품 목록
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Product]
    let bValue: any = b[sortBy as keyof Product]
    
    if (sortBy === 'price' || sortBy === 'quantity') {
      aValue = Number(aValue) || 0
      bValue = Number(bValue) || 0
    } else if (sortBy === 'createdAt' || sortBy === 'inStockDate') {
      aValue = aValue ? new Date(aValue).getTime() : 0
      bValue = bValue ? new Date(bValue).getTime() : 0
    } else {
      aValue = String(aValue || '').toLowerCase()
      bValue = String(bValue || '').toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // 상품이 할당된 위치 찾기
  const getProductLocations = (productId: string) => {
    return locations.filter(location => location.product?.id === productId)
  }

  // 상품 편집
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  // 상품 삭제
  const handleDeleteProduct = (productId: string) => {
    // 실제로는 API 호출
    setProducts(prev => prev.filter(p => p.id !== productId))
    toast({
      title: '상품 삭제 완료',
      description: '상품이 성공적으로 삭제되었습니다.',
    })
  }

  // 상품 저장
  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p))
      toast({
        title: '상품 수정 완료',
        description: '상품 정보가 성공적으로 수정되었습니다.',
      })
      setEditingProduct(null)
      setIsEditModalOpen(false)
    }
  }

  // 위치 정보 보기
  const handleViewLocations = (product: Product) => {
    setSelectedProduct(product)
    setIsLocationModalOpen(true)
  }

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setPriceRange({ min: '', max: '' })
    setSortBy('name')
    setSortOrder('asc')
  }

  // 통계 정보
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'displayed').length
  const lowStockProducts = products.filter(p => p.quantity < 10).length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            상품 검색
          </CardTitle>
          <CardDescription>
            등록된 상품을 검색하고 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 검색바 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="상품명, 브랜드, 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={resetFilters} variant="outline">
                필터 초기화
              </Button>
            </div>

            {/* 필터 옵션 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>카테고리</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>상태</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="registered">등록됨</SelectItem>
                    <SelectItem value="in_stock">재고 있음</SelectItem>
                    <SelectItem value="displayed">전시 중</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>최소 가격</Label>
                <Input
                  type="number"
                  placeholder="최소 가격"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>

              <div>
                <Label>최대 가격</Label>
                <Input
                  type="number"
                  placeholder="최대 가격"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-4">
              <Label>정렬 기준:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">상품명</SelectItem>
                  <SelectItem value="price">가격</SelectItem>
                  <SelectItem value="quantity">수량</SelectItem>
                  <SelectItem value="createdAt">등록일</SelectItem>
                  <SelectItem value="inStockDate">입고일</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '오름차순' : '내림차순'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 상품 수</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전시 중</p>
                <p className="text-2xl font-bold">{activeProducts}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">재고 부족</p>
                <p className="text-2xl font-bold">{lowStockProducts}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 재고 가치</p>
                <p className="text-2xl font-bold">{totalValue.toLocaleString()}원</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상품 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 결과 ({sortedProducts.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품 정보</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>입고일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.brand && (
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category || '미분류'}</Badge>
                  </TableCell>
                  <TableCell>{product.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <span className={product.quantity < 10 ? 'text-red-600 font-medium' : ''}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === 'displayed' ? 'default' :
                      product.status === 'in_stock' ? 'secondary' : 'outline'
                    }>
                      {product.status === 'displayed' ? '전시 중' :
                       product.status === 'in_stock' ? '재고 있음' : '등록됨'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.inStockDate ? new Date(product.inStockDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewLocations(product)}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 상품 편집 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>상품 정보 수정</DialogTitle>
            <DialogDescription>상품 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상품명</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label>브랜드</Label>
                  <Input
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, brand: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label>가격</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)}
                  />
                </div>
                <div>
                  <Label>수량</Label>
                  <Input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, quantity: parseInt(e.target.value) || 0 } : null)}
                  />
                </div>
                <div>
                  <Label>카테고리</Label>
                  <Select value={editingProduct.category || ''} onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, category: value } : null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
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
                <div>
                  <Label>상태</Label>
                  <Select value={editingProduct.status || 'registered'} onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, status: value as 'registered' | 'in_stock' | 'displayed' } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registered">등록됨</SelectItem>
                      <SelectItem value="in_stock">재고 있음</SelectItem>
                      <SelectItem value="displayed">전시 중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>설명</Label>
                <Input
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="상품 설명"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProduct} className="flex-1">저장</Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>취소</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 위치 정보 모달 */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상품 위치 정보</DialogTitle>
            <DialogDescription>{selectedProduct?.name}이(가) 할당된 위치들입니다.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                {getProductLocations(selectedProduct.id).map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{location.parentId}</p>
                      <p className="text-sm text-gray-500">{location.layer} 층</p>
                    </div>
                    <Badge variant="outline">
                      {location.currentQuantity}/{location.maxQuantity}
                    </Badge>
                  </div>
                ))}
                {getProductLocations(selectedProduct.id).length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    이 상품이 할당된 위치가 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
