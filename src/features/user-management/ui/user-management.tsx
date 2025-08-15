'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Users, Settings } from 'lucide-react'

interface UserManagementProps {
  userRole: 'admin' | 'branch'
}

export function UserManagement({ userRole }: UserManagementProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            사용자 관리
          </CardTitle>
          <CardDescription>
            {userRole === 'admin' ? '전체 사용자를 관리하세요' : '권한이 제한된 사용자입니다'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRole === 'admin' ? (
            <div className="text-center text-gray-500 py-8">
              사용자 관리 기능 - 구현 중...
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              관리자 권한이 필요합니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
