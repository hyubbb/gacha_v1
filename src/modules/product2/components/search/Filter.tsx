import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared';
import { Search } from 'lucide-react';
import type { FilterProps } from '@/modules/product2/lib/types';

export const Filter = ({
  searchTerm,
  setSearchTerm,
  resetFilters,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories
}: FilterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          상품 검색
        </CardTitle>
        <CardDescription>등록된 상품을 검색하고 관리하세요</CardDescription>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
              />
            </div>

            <div>
              <Label>최대 가격</Label>
              <Input
                type="number"
                placeholder="최대 가격"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
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
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '오름차순' : '내림차순'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
