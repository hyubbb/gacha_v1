'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Badge } from '@/shared/ui/badge'
import { Plus, Settings, Package, Edit, AlertCircle, Trash2 } from 'lucide-react'
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
  const [isAddParentLocationModalOpen, setIsAddParentLocationModalOpen] = useState(false)
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false)
  const [newParentLocation, setNewParentLocation] = useState({ row: '', col: '', name: '' })
  const [newLocation, setNewLocation] = useState({ parentId: '', layer: 'middle' as 'top' | 'middle' | 'bottom', price: '', maxQuantity: '' })

  const availableProducts: Product[] = getMockProducts()

  const [parentLocations, setParentLocations] = useState<ParentLocation[]>(getMockParentLocations())
  const [locations, setLocations] = useState<Slot[]>(getMockLocations())

  const refreshMockData = () => {
    setParentLocations(getMockParentLocations())
    setLocations(getMockLocations())
  }

  const handleLocationClick = (row: number, col: number) => {
    setSelectedLocationCell({ row, col })
    const existingLocation = locations.find(l => l.row === row && l.col === col)
    if (existingLocation) {
      setEditingLocation(existingLocation)
    } else {
      setEditingLocation(null)
    }
  }

  const handleParentLocationClick = (row: number, col: number) => {
    setSelectedLocationCell({ row, col })
    const existingParentLocation = parentLocations.find(pl => pl.row === row && pl.col === col)
    if (existingParentLocation) {
      setEditingParentLocation(existingParentLocation)
    } else {
      setEditingParentLocation(null)
    }
  }

  const handleSaveLocation = () => {
    if (editingLocation) {
      updateMockLocation(editingLocation)
      setLocations(getMockLocations())
      toast({
        title: '위치 업데이트 완료',
        description: '위치 정보가 성공적으로 업데이트되었습니다.',
      })
      setEditingLocation(null)
      setSelectedLocationCell(null)
    }
  }

  const handleSaveParentLocation = () => {
    if (editingParentLocation) {
      updateMockParentLocation(editingParentLocation)
      setParentLocations(getMockParentLocations())
      toast({
        title: '부모 위치 업데이트 완료',
        description: '부모 위치 정보가 성공적으로 업데이트되었습니다.',
      })
      setEditingParentLocation(null)
      setSelectedLocationCell(null)
    }
  }

  const handleDeleteLocation = (locationId: string) => {
    deleteMockLocation(locationId)
    setLocations(getMockLocations())
    toast({
      title: '위치 삭제 완료',
      description: '위치가 성공적으로 삭제되었습니다.',
    })
    setEditingLocation(null)
    setSelectedLocationCell(null)
  }

  const handleDeleteParentLocation = (parentLocationId: string) => {
    deleteMockParentLocation(parentLocationId)
    setParentLocations(getMockParentLocations())
    setLocations(getMockLocations())
    toast({
      title: '부모 위치 삭제 완료',
      description: '부모 위치와 관련된 모든 하위 위치가 삭제되었습니다.',
    })
    setEditingParentLocation(null)
    setSelectedLocationCell(null)
  }

  const handleAddParentLocation = () => {
    if (newParentLocation.row && newParentLocation.col) {
      const parentLocation: ParentLocation = {
        id: `${newParentLocation.row}-${newParentLocation.col}`,
        row: parseInt(newParentLocation.row),
        col: parseInt(newParentLocation.col),
        name: newParentLocation.name || undefined
      }
      addMockParentLocation(parentLocation)
      setParentLocations(getMockParentLocations())
      toast({
        title: '부모 위치 추가 완료',
        description: '새로운 부모 위치가 추가되었습니다.',
      })
      setNewParentLocation({ row: '', col: '', name: '' })
      setIsAddParentLocationModalOpen(false)
    }
  }

  const handleAddLocation = () => {
    if (newLocation.parentId && newLocation.price && newLocation.maxQuantity) {
      const parentLocation = parentLocations.find(pl => pl.id === newLocation.parentId)
      if (parentLocation) {
        const location: Slot = {
          id: `${newLocation.parentId}-${newLocation.layer}`,
          parentId: newLocation.parentId,
          row: parentLocation.row,
          col: parentLocation.col,
          layer: newLocation.layer,
          price: parseInt(newLocation.price),
          maxQuantity: parseInt(newLocation.maxQuantity),
          currentQuantity: 0,
          status: 'active'
        }
        addMockLocation(location)
        setLocations(getMockLocations())
        toast({
          title: '위치 추가 완료',
          description: '새로운 위치가 추가되었습니다.',
        })
        setNewLocation({ parentId: '', layer: 'middle', price: '', maxQuantity: '' })
        setIsAddLocationModalOpen(false)
      }
    }
  }

  const getLocationAtPosition = (row: number, col: number) => {
    return locations.find(l => l.row === row && l.col === col)
  }

  const getParentLocationAtPosition = (row: number, col: number) => {
    return parentLocations.find(pl => pl.row === row && pl.col === col)
  }

  const getLocationColor = (location: Slot) => {
    if (location.status === 'inactive') return 'bg-gray-400'
    if (location.currentQuantity === 0) return 'bg-green-200'
    if (location.currentQuantity >= location.maxQuantity) return 'bg-red-200'
    return 'bg-blue-200'
  }

  const getParentLocationColor = (parentLocation: ParentLocation) => {
    const hasLocations = locations.some(l => l.parentId === parentLocation.id)
    return hasLocations ? 'bg-purple-200' : 'bg-yellow-200'
  }

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
          <div className="space-y-4">
            {/* 맵 크기 설정 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>행:</Label>
                <Input
                  type="number"
                  value={mapSize.rows}
                  onChange={(e) => setMapSize(prev => ({ ...prev, rows: clampInt(parseInt(e.target.value) || 10, 5, 20) }))}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label>열:</Label>
                <Input
                  type="number"
                  value={mapSize.cols}
                  onChange={(e) => setMapSize(prev => ({ ...prev, cols: clampInt(parseInt(e.target.value) || 15, 5, 30) }))}
                  className="w-20"
                />
              </div>
              <Button onClick={() => setIsAddParentLocationModalOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                부모 위치 추가
              </Button>
              <Button onClick={() => setIsAddLocationModalOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                위치 추가
              </Button>
            </div>

            {/* 슬롯 맵 */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mapSize.cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: mapSize.rows }, (_, row) =>
                  Array.from({ length: mapSize.cols }, (_, col) => {
                    const location = getLocationAtPosition(row + 1, col + 1)
                    const parentLocation = getParentLocationAtPosition(row + 1, col + 1)
                    
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`
                          w-12 h-12 border border-gray-300 rounded cursor-pointer flex items-center justify-center text-xs font-medium
                          ${location ? getLocationColor(location) : parentLocation ? getParentLocationColor(parentLocation) : 'bg-gray-100'}
                          ${selectedLocationCell?.row === row + 1 && selectedLocationCell?.col === col + 1 ? 'ring-2 ring-blue-500' : ''}
                        `}
                        onClick={() => location ? handleLocationClick(row + 1, col + 1) : handleParentLocationClick(row + 1, col + 1)}
                      >
                        {location ? (
                          <div className="text-center">
                            <div className="font-bold">{location.layer === 'top' ? 'T' : location.layer === 'middle' ? 'M' : 'B'}</div>
                            <div className="text-xs">{location.currentQuantity}/{location.maxQuantity}</div>
                          </div>
                        ) : parentLocation ? (
                          <div className="text-center">
                            <div className="font-bold">P</div>
                            <div className="text-xs">{parentLocation.name || `${parentLocation.row}-${parentLocation.col}`}</div>
                          </div>
                        ) : (
                          `${row + 1}-${col + 1}`
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* 범례 */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-200 border border-gray-300 rounded"></div>
                <span>부모 위치 (위치 있음)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 border border-gray-300 rounded"></div>
                <span>부모 위치 (위치 없음)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-gray-300 rounded"></div>
                <span>빈 위치</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border border-gray-300 rounded"></div>
                <span>상품 있음</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border border-gray-300 rounded"></div>
                <span>가득 참</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 border border-gray-300 rounded"></div>
                <span>비활성</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 위치 편집 다이얼로그 */}
      <Dialog open={!!selectedLocationCell} onOpenChange={(open) => {
        if (!open) {
          setSelectedLocationCell(null)
          setEditingLocation(null)
          setEditingParentLocation(null)
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? '위치 편집' : editingParentLocation ? '부모 위치 편집' : '새 위치 추가'}
            </DialogTitle>
            <DialogDescription>
              {editingLocation ? '위치 정보를 수정하세요' : editingParentLocation ? '부모 위치 정보를 수정하세요' : '새로운 위치를 추가하세요'}
            </DialogDescription>
          </DialogHeader>
          
          {editingLocation && (
            <div className="space-y-4">
              <div>
                <Label>위치 ID</Label>
                <Input value={editingLocation.id} disabled />
              </div>
              <div>
                <Label>층</Label>
                <Select value={editingLocation.layer} onValueChange={(value) => setEditingLocation(prev => prev ? { ...prev, layer: value as 'top' | 'middle' | 'bottom' } : null)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">상단</SelectItem>
                    <SelectItem value="middle">중간</SelectItem>
                    <SelectItem value="bottom">하단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>가격</Label>
                <Input
                  type="number"
                  value={editingLocation.price}
                  onChange={(e) => setEditingLocation(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>최대 수량</Label>
                <Input
                  type="number"
                  value={editingLocation.maxQuantity}
                  onChange={(e) => setEditingLocation(prev => prev ? { ...prev, maxQuantity: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>현재 수량</Label>
                <Input
                  type="number"
                  value={editingLocation.currentQuantity}
                  onChange={(e) => setEditingLocation(prev => prev ? { ...prev, currentQuantity: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>상태</Label>
                <Select value={editingLocation.status} onValueChange={(value) => setEditingLocation(prev => prev ? { ...prev, status: value as 'active' | 'inactive' | 'maintenance' } : null)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                    <SelectItem value="maintenance">점검</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveLocation} className="flex-1">저장</Button>
                <Button variant="destructive" onClick={() => handleDeleteLocation(editingLocation.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          )}

          {editingParentLocation && (
            <div className="space-y-4">
              <div>
                <Label>위치 ID</Label>
                <Input value={editingParentLocation.id} disabled />
              </div>
              <div>
                <Label>행</Label>
                <Input
                  type="number"
                  value={editingParentLocation.row}
                  onChange={(e) => setEditingParentLocation(prev => prev ? { ...prev, row: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>열</Label>
                <Input
                  type="number"
                  value={editingParentLocation.col}
                  onChange={(e) => setEditingParentLocation(prev => prev ? { ...prev, col: parseInt(e.target.value) || 0 } : null)}
                />
              </div>
              <div>
                <Label>이름</Label>
                <Input
                  value={editingParentLocation.name || ''}
                  onChange={(e) => setEditingParentLocation(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="위치 이름 (선택사항)"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveParentLocation} className="flex-1">저장</Button>
                <Button variant="destructive" onClick={() => handleDeleteParentLocation(editingParentLocation.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 부모 위치 추가 다이얼로그 */}
      <Dialog open={isAddParentLocationModalOpen} onOpenChange={setIsAddParentLocationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>부모 위치 추가</DialogTitle>
            <DialogDescription>새로운 부모 위치를 추가하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>행</Label>
              <Input
                type="number"
                value={newParentLocation.row}
                onChange={(e) => setNewParentLocation(prev => ({ ...prev, row: e.target.value }))}
                placeholder="행 번호"
              />
            </div>
            <div>
              <Label>열</Label>
              <Input
                type="number"
                value={newParentLocation.col}
                onChange={(e) => setNewParentLocation(prev => ({ ...prev, col: e.target.value }))}
                placeholder="열 번호"
              />
            </div>
            <div>
              <Label>이름 (선택사항)</Label>
              <Input
                value={newParentLocation.name}
                onChange={(e) => setNewParentLocation(prev => ({ ...prev, name: e.target.value }))}
                placeholder="위치 이름"
              />
            </div>
            <Button onClick={handleAddParentLocation} className="w-full">추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 위치 추가 다이얼로그 */}
      <Dialog open={isAddLocationModalOpen} onOpenChange={setIsAddLocationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>위치 추가</DialogTitle>
            <DialogDescription>기존 부모 위치에 새로운 위치를 추가하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>부모 위치</Label>
              <Select value={newLocation.parentId} onValueChange={(value) => setNewLocation(prev => ({ ...prev, parentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="부모 위치 선택" />
                </SelectTrigger>
                <SelectContent>
                  {parentLocations.map((pl) => (
                    <SelectItem key={pl.id} value={pl.id}>
                      {pl.name || `${pl.row}-${pl.col}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>층</Label>
              <Select value={newLocation.layer} onValueChange={(value) => setNewLocation(prev => ({ ...prev, layer: value as 'top' | 'middle' | 'bottom' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">상단</SelectItem>
                  <SelectItem value="middle">중간</SelectItem>
                  <SelectItem value="bottom">하단</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>가격</Label>
              <Input
                type="number"
                value={newLocation.price}
                onChange={(e) => setNewLocation(prev => ({ ...prev, price: e.target.value }))}
                placeholder="가격"
              />
            </div>
            <div>
              <Label>최대 수량</Label>
              <Input
                type="number"
                value={newLocation.maxQuantity}
                onChange={(e) => setNewLocation(prev => ({ ...prev, maxQuantity: e.target.value }))}
                placeholder="최대 수량"
              />
            </div>
            <Button onClick={handleAddLocation} className="w-full">추가</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
