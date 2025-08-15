'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Badge } from '@/shared/ui/badge'
import { Plus, Settings, Package, Edit, AlertCircle } from 'lucide-react'
import { useToast } from '@/shared/hooks/use-toast'
import {
  getMockLocations,
  getMockParentLocations,
  updateMockLocation,
  updateMockParentLocation,
  addMockParentLocation,
  deleteMockParentLocation,
  addMockLocation,
  deleteMockLocation
} from '@/entities/slot/api'
import { getMockProducts } from '@/entities/product/api'
import { Product } from '@/entities/product/model'
import { ParentLocation, Slot } from '@/entities/slot/model'

interface SlotMapViewProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

const clampInt = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export function SlotMapView({ userRole, currentStore }: SlotMapViewProps) {
  const { toast } = useToast()
  const [mapSize, setMapSize] = useState({ rows: 10, cols: 15 })
  const [selectedLocationCell, setSelectedLocationCell] = useState<{ row: number; col: number } | null>(null)
  const [editingLocation, setEditingLocation] = useState<Slot | null>(null)
  const [editingParentLocation, setEditingParentLocation] = useState<ParentLocation | null>(null)
  const [isAssignProductModalOpen, setIsAssignProductModalOpen] = useState(false)
  const [currentLocationForAssignment, setCurrentLocationForAssignment] = useState<Slot | null>(null)

  const availableProducts: Product[] = getMockProducts()

  const [parentLocations, setParentLocations] = useState<ParentLocation[]>(getMockParentLocations())
  const [locations, setLocations] = useState<Slot[]>(getMockLocations())

  const refreshMockData = () => {
    setParentLocations(getMockParentLocations())
    setLocations(getMockLocations())
  }

  // 나머지 컴포넌트 로직을 여기에 복사...
  // (기존 slot-map-view.tsx의 나머지 부분을 복사해야 함)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            슬롯 맵 관리
          </CardTitle>
          <CardDescription>
            {userRole === 'admin' ? '전체 지점의 슬롯을 관리하세요' : `${currentStore} 지점의 슬롯을 관리하세요`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 슬롯 맵 컨텐츠 */}
          <div className="text-center text-gray-500">
            슬롯 맵 뷰어 - 구현 중...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
