'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Upload, Eye, MapPin, Filter } from 'lucide-react'

interface ProductSearchProps {
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
  description: string
  tags: string[]
  category: string
  status: 'registered' | 'in_stock' | 'displayed'
}

export default function ProductSearch({ userRole, currentStore }: ProductSearchProps) {
  const [searchType, setSearchType] = useState<'text' | 'image'>('text')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchImage, setSearchImage] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 샘플 상품 데이터
  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      name: '코카콜라 500ml',
      image: '/placeholder.svg?height=150&width=150',
      price: 200,
      brand: '코카콜라',
      quantity: 50,
      description: '시원한 코카콜라 500ml',
      tags: ['음료', '탄산', '콜라'],
      category: '음료',
      status: 'in_stock'
    },
    {
      id: 'prod-2',
      name: '펩시콜라 500ml',
      image: '/placeholder.svg?height=150&width=150',
      price: 200,
      brand: '펩시',
      quantity: 30,
      description: '상쾌한 펩시콜라 500ml',
      tags: ['음료', '탄산', '콜라'],
      category: '음료',
      status: 'in_stock'
    },
    {
      id: 'prod-3',
      name: '스프라이트 500ml',
      image: '/placeholder.svg?height=150&width=150',
      price: 200,
      brand: '코카콜라',
      quantity: 25,
      description: '상큼한 스프라이트 500ml',
      tags: ['음료', '탄산', '사이다'],
      category: '음료',
      status: 'in_stock'
    },
    {
      id: 'prod-4',
      name: '포카칩 오리지널',
      image: '/placeholder.svg?height=150&width=150',
      price: 300,
      brand: '오리온',
      quantity: 40,
      description: '바삭한 포카칩 오리지널',
      tags: ['스낵', '과자', '감자칩'],
      category: '스낵',
      status: 'in_stock'
    }
  ]

  const categories = ['전체', '음료', '스낵', '아이스크림', '과자', '라면', '기타']

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSearchImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let results = [...sampleProducts]
      
      // 텍스트 검색
      if (searchType === 'text' && searchQuery) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      
      // 가격 범위 필터
      if (priceRange.min) {
        results = results.filter(product => product.price >= parseInt(priceRange.min))
      }
      if (priceRange.max) {
        results = results.filter(product => product.price <= parseInt(priceRange.max))
      }
      
      // 카테고리 필터
      if (selectedCategory && selectedCategory !== '전체') {
        results = results.filter(product => product.category === selectedCategory)
      }
      
      setSearchResults(results)
    } catch (error) {
      console.error('검색 오류:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleDisplayRegister = (product: Product) => {
    // 전시 등록 페이지로 이동하거나 모달 열기
    console.log('전시 등록:', product)
  }

  return (
    <div className="space-y-6">
      {/* 검색 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>상품 검색</span>
          </CardTitle>
          <CardDescription>
            텍스트 또는 이미지로 상품을 검색하고 전시 등록할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 검색 타입 선택 */}
          <div className="flex space-x-4">
            <Button
              variant={searchType === 'text' ? 'default' : 'outline'}
              onClick={() => setSearchType('text')}
            >
              텍스트 검색
            </Button>
            <Button
              variant={searchType === 'image' ? 'default' : 'outline'}
              onClick={() => setSearchType('image')}
            >
              이미지 검색
            </Button>
          </div>

          {/* 검색 입력 */}
          {searchType === 'text' ? (
            <div>
              <Label htmlFor="search-query">검색어</Label>
              <div className="flex space-x-2">
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="상품명, 브랜드, 태그로 검색"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Label>검색 이미지</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {searchImage ? (
                  <div className="text-center">
                    <img 
                      src={searchImage || "/placeholder.svg"} 
                      alt="검색 이미지" 
                      className="mx-auto h-32 w-32 object-cover rounded"
                    />
                    <Button 
                      className="mt-4" 
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      이미지로 검색
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="search-image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          이미지 업로드
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          유사한 상품을 찾아드립니다
                        </span>
                      </label>
                      <input
                        id="search-image-upload"
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
          )}

          {/* 추가 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>카테고리</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Label>최소 가격</Label>
              <Input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>최대 가격</Label>
              <Input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                placeholder="1000"
              />
            </div>
          </div>

          <Button onClick={handleSearch} disabled={isSearching} className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            {isSearching ? '검색 중...' : '검색'}
          </Button>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>검색 결과 ({searchResults.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={product.status === 'in_stock' ? 'default' : 'secondary'}
                    >
                      {product.status === 'in_stock' ? '재고' : 
                       product.status === 'displayed' ? '전시중' : '등록'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-600">{product.price}원</span>
                      <span className="text-sm text-gray-500">재고: {product.quantity}개</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        상세
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDisplayRegister(product)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        전시등록
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 결과가 없을 때 */}
      {searchResults.length === 0 && (searchQuery || searchImage) && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500 mb-4">다른 검색어나 필터 조건을 시도해보세요.</p>
            <Button variant="outline">수동 등록하기</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
