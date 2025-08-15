'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Search, Package } from 'lucide-react'

interface ProductSearchProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export function ProductSearch({ userRole, currentStore }: ProductSearchProps) {
  return (
    <div className="space-y-6">
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
            <div className="flex gap-4">
              <Input placeholder="상품명으로 검색..." className="flex-1" />
              <Input placeholder="브랜드로 검색..." className="flex-1" />
            </div>
            <div className="text-center text-gray-500 py-8">
              상품 검색 기능 - 구현 중...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
