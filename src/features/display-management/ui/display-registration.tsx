'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Package, Monitor } from 'lucide-react'

interface DisplayRegistrationProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

export function DisplayRegistration({ userRole, currentStore }: DisplayRegistrationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            전시 등록
          </CardTitle>
          <CardDescription>
            상품의 전시 위치를 관리하고 등록하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            전시 등록 기능 - 구현 중...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
