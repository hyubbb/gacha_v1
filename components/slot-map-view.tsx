'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Settings, Package, Edit, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getMockLocations,
  getMockParentLocations,
  updateMockLocation,
  updateMockParentLocation,
  addMockParentLocation,
  deleteMockParentLocation,
  addMockLocation,
  deleteMockLocation,
  getMockProducts
} from '@/lib/mock-data'
import { Product, ParentLocation, Slot } from '@/lib/types'

interface SlotMapViewProps {
  userRole: 'admin' | 'branch'
  currentStore: string
}

const clampInt = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export default function SlotMapView({ userRole, currentStore }: SlotMapViewProps) {
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

  const getParentLocation = (row: number, col: number) => {
    return parentLocations.find(ps => ps.row === row && ps.col === col)
  }

  const getLocationsInCell = (row: number, col: number) => {
    return locations.filter(location => location.row === row && location.col === col)
  }

  const getLayerColor = (location: Slot | undefined) => {
    if (!location) return 'bg-gray-100 border-gray-200'

    if (location.product && location.product.inStockDate) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      if (location.product.inStockDate < sevenDaysAgo) {
        return 'bg-yellow-100 border-yellow-300'
      }
    }

    switch (location.status) {
      case 'active':
        if (location.product) {
          if (location.currentQuantity === 0) return 'bg-red-100 border-red-300'
          if (location.currentQuantity < location.maxQuantity * 0.3) return 'bg-orange-100 border-orange-300'
          return 'bg-green-100 border-green-300'
        }
        return 'bg-blue-100 border-blue-300'
      case 'inactive':
        return 'bg-gray-200 border-gray-400'
      case 'maintenance':
        return 'bg-purple-100 border-purple-300'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const hasPriceMismatch = (location: Slot | undefined) => {
    return !!(location?.product && location.price !== location.product.price)
  }

  const handleLocationCellClick = (row: number, col: number) => {
    setSelectedLocationCell({ row, col })
  }

  // 부모 위치 추가: 임시 객체를 폼에 전달
  const handleAddParentLocation = (row: number, col: number) => {
    const newParentLocation: ParentLocation = {
      id: `TEMP-${Date.now()}`,
      row,
      col,
      name: ''
    }
    setEditingParentLocation(newParentLocation)
  }

  // 위치 생성 및 상품 할당: 중복 방지 및 기본 maxQuantity=30
  const handleCreateLocationAndAssignProduct = (parentLocation: ParentLocation, layer: 'top' | 'middle' | 'bottom') => {
    // 중복 방지: 이미 같은 셀/레이어에 위치가 있으면 차단
    const exists = getMockLocations().some(
      l => l.parentId === parentLocation.id && l.layer === layer
    )
    if (exists) {
      toast({
        title: '중복 위치',
        description: '해당 층에 이미 위치가 존재합니다.',
        variant: 'destructive'
      })
      return
    }

    const newLocation: Slot = {
      id: `TEMP-${Date.now()}`,
      parentId: parentLocation.id,
      row: parentLocation.row,
      col: parentLocation.col,
      layer,
      price: 0,
      maxQuantity: 30, // 기본값 30
      currentQuantity: 0,
      status: 'active'
    }
    setCurrentLocationForAssignment(newLocation)
    setIsAssignProductModalOpen(true)
  }

  // 부모 위치 저장 (추가/수정)
  const handleUpdateParentLocation = (updatedParentLocation: ParentLocation, isNew: boolean) => {
    const existing = getMockParentLocations()
    const isIdConflict = existing.some(ps => ps.id === updatedParentLocation.id && (!editingParentLocation || ps.id !== editingParentLocation.id))

    if (isIdConflict) {
      toast({
        title: 'ID 중복',
        description: `부모 위치 ID '${updatedParentLocation.id}'는 이미 사용 중입니다.`,
        variant: 'destructive'
      })
      return
    }

    if (isNew) {
      addMockParentLocation(updatedParentLocation)
    } else {
      // ID 변경 시 자식 위치 ID 갱신
      if (editingParentLocation && editingParentLocation.id !== updatedParentLocation.id) {
        const oldParentId = editingParentLocation.id
        const newParentId = updatedParentLocation.id
        getMockLocations().forEach(location => {
          if (location.parentId === oldParentId) {
            const layerNumber = location.layer === 'top' ? '1' : location.layer === 'middle' ? '2' : '3'
            updateMockLocation({
              ...location,
              id: `${newParentId}-${layerNumber}`,
              parentId: newParentId
            })
          }
        })
      }
      updateMockParentLocation(updatedParentLocation)
    }

    refreshMockData()
    setEditingParentLocation(null)
    toast({
      title: '저장 완료',
      description: '부모 위치 정보가 저장되었습니다.'
    })
  }

  // 위치 정보 저장
  const handleUpdateLocation = (updatedLocation: Slot) => {
    // maxQuantity는 30 이하로 제한
    const fixed = { ...updatedLocation, maxQuantity: clampInt(updatedLocation.maxQuantity, 1, 30) }
    updateMockLocation(fixed)
    refreshMockData()
    setEditingLocation(null)
    toast({
      title: '위치 업데이트 완료',
      description: `위치 ${fixed.id} 정보가 저장되었습니다.`
    })
  }

  // 위치 삭제 (확인)
  const handleDeleteLocation = (locationId: string) => {
    if (!confirm(`정말 위치 ${locationId}을(를) 삭제하시겠습니까?`)) return
    deleteMockLocation(locationId)
    refreshMockData()
    setEditingLocation(null)
    toast({
      title: '삭제 완료',
      description: `위치 ${locationId}이(가) 삭제되었습니다.`
    })
  }

  // 부모 위치 삭제 (확인)
  const handleDeleteParentLocation = (parentLocationId: string) => {
    if (!confirm(`정말 부모 위치 ${parentLocationId} 및 하위 위치를 모두 삭제하시겠습니까?`)) return
    deleteMockParentLocation(parentLocationId)
    refreshMockData()
    setEditingParentLocation(null)
    setSelectedLocationCell(null)
    toast({
      title: '삭제 완료',
      description: `부모 위치 ${parentLocationId} 및 관련 위치가 삭제되었습니다.`
    })
  }

  // 상품 할당 모달 저장 콜백
  const handleProductAssignmentComplete = (updatedLocation: Slot, isNewLocation: boolean) => {
    // maxQuantity는 30 이하로 보장
    const fixed = { ...updatedLocation, maxQuantity: clampInt(updatedLocation.maxQuantity, 1, 30) }
    if (isNewLocation) addMockLocation(fixed)
    else updateMockLocation(fixed)

    setIsAssignProductModalOpen(false)
    setCurrentLocationForAssignment(null)
    refreshMockData()
    toast({
      title: '상품 할당 완료',
      description: `${fixed.product?.name}이(가) 위치 ${fixed.row},${fixed.col} (${fixed.layer === 'top' ? '상단' : fixed.layer === 'middle' ? '중단' : '하단'})에 할당되었습니다.`
    })
  }

  const handleProductAssignmentCancel = () => {
    setIsAssignProductModalOpen(false)
    setCurrentLocationForAssignment(null)
  }

  const currentCellLocations = selectedLocationCell ? getLocationsInCell(selectedLocationCell.row, selectedLocationCell.col) : []
  const currentParentLocation = selectedLocationCell ? getParentLocation(selectedLocationCell.row, selectedLocationCell.col) : null

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>위치 맵 관리</span>
          </CardTitle>
          <CardDescription>
            {currentStore === 'store-001' ? '강남점' : currentStore === 'store-002' ? '홍대점' : '명동점'} 위치 배치 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Label>맵 크기:</Label>
            <Input
              type="number"
              value={mapSize.cols}
              onChange={(e) => setMapSize({ ...mapSize, cols: parseInt(e.target.value) || 15 })}
              className="w-20"
              min={5}
              max={50}
              placeholder="가로 (열)"
            />
            <span>×</span>
            <Input
              type="number"
              value={mapSize.rows}
              onChange={(e) => setMapSize({ ...mapSize, rows: parseInt(e.target.value) || 10 })}
              className="w-20"
              min={5}
              max={50}
              placeholder="세로 (행)"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>정상</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
              <span>재고 부족</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>품절</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>장기 재고 (7일 이상)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>빈 위치 (활성)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
              <span>비활성</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
              <span>점검중</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>미설정</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
              <span>가격 불일치</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Map */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-auto">
            <div
              className="grid gap-1 min-w-max"
              style={{
                gridTemplateColumns: `repeat(${mapSize.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${mapSize.rows}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: mapSize.rows * mapSize.cols }, (_, index) => {
                const row = Math.floor(index / mapSize.cols)
                const col = index % mapSize.cols
                const cellLocations = getLocationsInCell(row, col)
                const parentLocation = getParentLocation(row, col)

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`
                      w-16 h-16 border-2 rounded cursor-pointer transition-all hover:scale-105
                      ${selectedLocationCell?.row === row && selectedLocationCell?.col === col ? 'ring-2 ring-blue-500' : ''}
                      flex flex-col justify-around items-center p-1 relative
                    `}
                    onClick={() => handleLocationCellClick(row, col)}
                    title={parentLocation ? `${parentLocation.name || ''} (${row}, ${col})` : `위치: (${row}, ${col})`}
                  >
                    {/* 부모 위치 라벨: (row,col)로 표기 */}
                    {parentLocation && (
                      <div className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs px-1 rounded text-[10px]">
                        {row},{col}
                      </div>
                    )}
                    {['top', 'middle', 'bottom'].map((layerName) => {
                      const layer = layerName as 'top' | 'middle' | 'bottom'
                      const location = cellLocations.find(s => s.layer === layer)
                      return (
                        <div
                          key={layer}
                          className={`w-full h-1/3 flex items-center justify-center text-xs rounded-sm
                            ${getLayerColor(location)}
                            ${hasPriceMismatch(location) ? 'border-2 border-red-500' : ''}
                          `}
                          title={location ? `(${row},${col}) ${layer === 'top' ? '상단' : layer === 'middle' ? '중단' : '하단'}: ${location.product?.name || '빈 위치'} (${location.currentQuantity}/${location.maxQuantity}) - ${location.price}원` : `미설정 (${layerName})`}
                        >
                          {location?.product ? (
                            <Package className="h-3 w-3 text-gray-600" />
                          ) : (
                            location ? <div className="w-2 h-2 bg-gray-400 rounded-full"></div> : null
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details Dialog */}
      {selectedLocationCell && (
        <Dialog
          open={!!selectedLocationCell}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedLocationCell(null)
              setEditingLocation(null)
              setEditingParentLocation(null)
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>위치 관리</DialogTitle>
              <DialogDescription>
                위치: ({selectedLocationCell.row}, {selectedLocationCell.col})
                {currentParentLocation && ` - ${currentParentLocation.name || '이름 없음'}`}
              </DialogDescription>
            </DialogHeader>

            {editingLocation ? (
              <LocationEditForm
                location={editingLocation}
                onSave={handleUpdateLocation}
                onCancel={() => setEditingLocation(null)}
                onDelete={handleDeleteLocation}
                availableProducts={availableProducts}
              />
            ) : editingParentLocation ? (
              <ParentLocationEditForm
                parentLocation={editingParentLocation}
                isNew={editingParentLocation.id.startsWith('TEMP-')}
                onSave={handleUpdateParentLocation}
                onCancel={() => setEditingParentLocation(null)}
                onDelete={handleDeleteParentLocation}
              />
            ) : (
              <div className="space-y-6">
                {/* 부모 위치 정보 */}
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">부모 위치 정보</h4>
                    <div className="flex space-x-2">
                      {!currentParentLocation && (
                        <Button size="sm" onClick={() => handleAddParentLocation(selectedLocationCell.row, selectedLocationCell.col)}>
                          <Plus className="h-4 w-4 mr-1" /> 위치 추가
                        </Button>
                      )}
                      {currentParentLocation && (
                        <Button size="sm" variant="outline" onClick={() => setEditingParentLocation(currentParentLocation)}>
                          <Settings className="h-4 w-4 mr-1" /> 위치 수정
                        </Button>
                      )}
                    </div>
                  </div>
                  {currentParentLocation ? (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Label>좌표</Label>
                        <p className="font-medium">{currentParentLocation.row}, {currentParentLocation.col}</p>
                      </div>
                      <div>
                        <Label>위치 이름</Label>
                        <p className="font-medium">{currentParentLocation.name || '이름 없음'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">이 위치에는 부모 위치가 설정되지 않았습니다.</p>
                  )}
                </Card>

                {/* 층별 위치 정보 */}
                {currentParentLocation && (
                  <>
                    {['top', 'middle', 'bottom'].map((layerName) => {
                      const layer = layerName as 'top' | 'middle' | 'bottom'
                      const location = currentCellLocations.find(s => s.layer === layer)
                      const layerKorean = layer === 'top' ? '상단' : layer === 'middle' ? '중단' : '하단'

                      return (
                        <Card key={layer} className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-lg">{layerKorean}층 ({layer === 'top' ? '1' : layer === 'middle' ? '2' : '3'})</h4>
                            <div className="flex space-x-2">
                              {!location ? (
                                <Button size="sm" onClick={() => handleCreateLocationAndAssignProduct(currentParentLocation, layer)}>
                                  <Plus className="h-4 w-4 mr-1" /> 상품 할당
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" onClick={() => setEditingLocation(location)}>
                                  <Settings className="h-4 w-4 mr-1" /> 위치 수정
                                </Button>
                              )}
                            </div>
                          </div>
                          {location ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <Label>좌표</Label>
                                  <p className="font-medium">{location.row}, {location.col}</p>
                                </div>
                                <div>
                                  <Label>위치 가격</Label>
                                  <p className="font-medium">{location.price}원</p>
                                </div>
                                <div>
                                  <Label>상태</Label>
                                  <Badge
                                    variant={location.status === 'active' ? 'default' : 'secondary'}
                                    className="ml-1"
                                  >
                                    {location.status === 'active' ? '활성' :
                                     location.status === 'inactive' ? '비활성' : '점검중'}
                                  </Badge>
                                </div>
                              </div>

                              {location.product ? (
                                <>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <img
                                      src={location.product.image || "/placeholder.svg"}
                                      alt={location.product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                      <h5 className="font-medium">{location.product.name}</h5>
                                      <p className="text-sm text-gray-500">상품 ID: {location.product.id}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                      <Label>상품 가격</Label>
                                      <p className="font-medium">{location.product.price}원</p>
                                    </div>
                                    <div>
                                      <Label>재고 현황</Label>
                                      <p className="font-medium">
                                        {location.currentQuantity} / {location.maxQuantity}
                                      </p>
                                    </div>
                                    {location.product?.inStockDate && (
                                      <div>
                                        <Label>입고일</Label>
                                        <p className="font-medium">
                                          {location.product.inStockDate.toLocaleDateString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  {hasPriceMismatch(location) && (
                                    <div className="flex items-center text-red-600 text-sm mt-2">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      <span>위치 가격({location.price}원)과 상품 가격({location.product.price}원)이 다릅니다!</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className="text-gray-500">등록된 상품이 없습니다.</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500">이 층에는 위치가 설정되지 않았습니다.</p>
                          )}
                        </Card>
                      )
                    })}
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* 상품 할당 모달 */}
      {currentLocationForAssignment && (
        <Dialog open={isAssignProductModalOpen} onOpenChange={setIsAssignProductModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>상품 할당</DialogTitle>
              <DialogDescription>
                좌표 {currentLocationForAssignment.row},{currentLocationForAssignment.col} ({currentLocationForAssignment.layer === 'top' ? '상단' : currentLocationForAssignment.layer === 'middle' ? '중단' : '하단'})에 상품을 할당합니다.
              </DialogDescription>
            </DialogHeader>
            <ProductRegistrationAndAssignmentForm
              location={currentLocationForAssignment}
              availableProducts={availableProducts}
              onComplete={handleProductAssignmentComplete}
              onCancel={handleProductAssignmentCancel}
              isNew={currentLocationForAssignment.id.startsWith('TEMP-')}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// 부모 위치 편집 폼
interface ParentLocationEditFormProps {
  parentLocation: ParentLocation
  isNew: boolean
  onSave: (updatedParentLocation: ParentLocation, isNew: boolean) => void
  onCancel: () => void
  onDelete: (parentLocationId: string) => void
}

function ParentLocationEditForm({ parentLocation, isNew, onSave, onCancel, onDelete }: ParentLocationEditFormProps) {
  const [editId, setEditId] = useState(parentLocation.id)
  const [editName, setEditName] = useState(parentLocation.name || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(
      {
        ...parentLocation,
        id: editId,
        name: editName
      },
      isNew
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-parent-id">부모 위치 ID</Label>
          <Input
            id="edit-parent-id"
            value={editId}
            onChange={(e) => setEditId(e.target.value)}
            placeholder="예: 2-3"
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-parent-name">위치 이름</Label>
          <Input
            id="edit-parent-name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="예: 메인 음료 구역"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        {!isNew && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (confirm('정말 부모 위치를 삭제하시겠습니까? 관련된 위치도 모두 삭제됩니다.')) {
                onDelete(parentLocation.id)
              }
            }}
          >
            부모 위치 삭제
          </Button>
        )}
        <Button type="submit">{isNew ? '추가' : '저장'}</Button>
      </div>
    </form>
  )
}

// 위치 편집 폼
interface LocationEditFormProps {
  location: Slot
  onSave: (updatedLocation: Slot) => void
  onCancel: () => void
  onDelete: (locationId: string) => void
  availableProducts: Product[]
}

function LocationEditForm({ location, onSave, onCancel, onDelete, availableProducts }: LocationEditFormProps) {
  const { toast } = useToast()
  const [editPrice, setEditPrice] = useState(location.price.toString())
  const [editMaxQuantity, setEditMaxQuantity] = useState(location.maxQuantity.toString())
  const [editStatus, setEditStatus] = useState(location.status)

  // 로컬 상품/수량
  const [localProduct, setLocalProduct] = useState(location.product)
  const [localCurrentQuantity, setLocalCurrentQuantity] = useState(location.currentQuantity.toString())
  const [selectedProductIdForAssignment, setSelectedProductIdForAssignment] = useState<string>(location.product?.id || '')

  const [isProductModifyModalOpen, setIsProductModifyModalOpen] = useState(false)

  const selectedProductDetailsForAssignment = availableProducts.find(p => p.id === selectedProductIdForAssignment)

  const maxCap = 30

  // 상품 할당 (로컬 상태만)
  const handleAssignProductLocally = () => {
    const productToAssign = availableProducts.find(p => p.id === selectedProductIdForAssignment)
    const quantity = parseInt(localCurrentQuantity)

    if (!productToAssign) {
      toast({ title: '상품 선택 오류', description: '상품을 선택해주세요.', variant: 'destructive' })
      return
    }
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: '수량 오류', description: '유효한 수량을 입력해주세요.', variant: 'destructive' })
      return
    }

    const maxAllowed = clampInt(parseInt(editMaxQuantity) || 0, 1, maxCap)
    if (quantity > maxAllowed) {
      toast({ title: '수량 초과', description: `최대 수량 ${maxAllowed}개를 초과할 수 없습니다.`, variant: 'destructive' })
      return
    }

    // 가격 불일치 방지: 위치 가격 0이면 자동 초기화, 아니면 동일해야 함
    const locPrice = parseInt(editPrice) || 0
    if (locPrice === 0) {
      setEditPrice(String(productToAssign.price))
    } else if (locPrice !== productToAssign.price) {
      toast({ title: '가격 불일치', description: '위치 가격과 상품 가격이 다릅니다. 위치 가격을 맞춰주세요.', variant: 'destructive' })
      return
    }

    setLocalProduct({
      id: productToAssign.id,
      name: productToAssign.name,
      image: productToAssign.image,
      price: productToAssign.price,
      inStockDate: new Date()
    })
    setLocalCurrentQuantity(quantity.toString())
    toast({ title: '상품 할당 준비 완료', description: '위치 정보 저장 버튼을 눌러 변경사항을 확정하세요.' })
  }

  const handleProductModifyOrReplaceComplete = (updatedLocationFromModal?: Slot) => {
    setIsProductModifyModalOpen(false)
    if (updatedLocationFromModal) {
      // 가격 불일치 방지: 위치 가격 0이면 새 가격으로 설정
      if ((parseInt(editPrice) || 0) === 0 && updatedLocationFromModal.product) {
        setEditPrice(String(updatedLocationFromModal.product.price))
      }
      setLocalProduct(updatedLocationFromModal.product)
      setLocalCurrentQuantity(updatedLocationFromModal.currentQuantity.toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fixedMax = clampInt(parseInt(editMaxQuantity) || 0, 1, maxCap)
    const fixedPrice = Math.max(0, parseInt(editPrice) || 0)
    const qty = clampInt(parseInt(localCurrentQuantity) || 0, 0, fixedMax)

    onSave({
      ...location,
      price: fixedPrice,
      maxQuantity: fixedMax,
      status: editStatus,
      currentQuantity: qty,
      product: localProduct
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-price">위치 가격 (원)</Label>
          <Input
            id="edit-price"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            min={0}
            step={1}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-max-quantity">최대 수량 (최대 30)</Label>
          <Input
            id="edit-max-quantity"
            type="number"
            value={editMaxQuantity}
            onChange={(e) => setEditMaxQuantity(e.target.value)}
            min={1}
            max={30}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-status">상태</Label>
        <Select value={editStatus} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setEditStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="inactive">비활성</SelectItem>
            <SelectItem value="maintenance">점검중</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4 border-dashed">
        <CardTitle className="text-md mb-3">상품 할당/변경</CardTitle>
        {localProduct ? (
          <>
            <div className="flex items-center space-x-3 mb-4 p-2 border rounded-md bg-gray-50">
              <img src={localProduct.image || "/placeholder.svg"} alt={localProduct.name} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-medium">{localProduct.name}</p>
                <p className="text-sm text-gray-500">현재 수량: {localCurrentQuantity}개</p>
                <p className="text-sm text-gray-500">상품 가격: {localProduct.price}원</p>
                {localProduct.inStockDate && (
                  <p className="text-xs text-gray-400">입고일: {localProduct.inStockDate.toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setIsProductModifyModalOpen(true)}>
                <Edit className="h-4 w-4 mr-1" /> 수정
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="select-product">상품 선택</Label>
              <Select value={selectedProductIdForAssignment} onValueChange={setSelectedProductIdForAssignment}>
                <SelectTrigger id="select-product">
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
            {selectedProductDetailsForAssignment && (
              <div className="flex items-center space-x-3 p-2 border rounded-md bg-blue-50">
                <img src={selectedProductDetailsForAssignment.image || "/placeholder.svg"} alt={selectedProductDetailsForAssignment.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-medium">{selectedProductDetailsForAssignment.name}</p>
                  <p className="text-sm text-gray-500">가격: {selectedProductDetailsForAssignment.price}원</p>
                  <p className="text-sm text-gray-500">재고: {selectedProductDetailsForAssignment.quantity}개</p>
                  {selectedProductDetailsForAssignment.inStockDate && (
                    <p className="text-xs text-gray-400">입고일: {selectedProductDetailsForAssignment.inStockDate.toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="quantity-to-add">수량</Label>
              <Input
                id="quantity-to-add"
                type="number"
                value={localCurrentQuantity}
                onChange={(e) => setLocalCurrentQuantity(e.target.value)}
                placeholder="수량 입력"
                min={0}
                max={30}
              />
              <p className="text-xs text-gray-500 mt-1">최대 {Math.min(parseInt(editMaxQuantity) || 0, 30)}개까지 가능</p>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleAssignProductLocally}
                disabled={
                  !selectedProductIdForAssignment ||
                  isNaN(parseInt(localCurrentQuantity)) ||
                  parseInt(localCurrentQuantity) > clampInt(parseInt(editMaxQuantity) || 0, 1, 30)
                }
              >
                상품 할당
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            if (confirm('정말 이 위치를 삭제하시겠습니까?')) onDelete(location.id)
          }}
        >
          위치 삭제
        </Button>
        <Button type="submit">위치 정보 저장</Button>
      </div>

      {isProductModifyModalOpen && (
        <Dialog open={isProductModifyModalOpen} onOpenChange={setIsProductModifyModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>상품 정보 수정 / 교체</DialogTitle>
              <DialogDescription>
                좌표 {location.row},{location.col}에 할당된 상품 정보를 수정/교체합니다.
              </DialogDescription>
            </DialogHeader>
            <ProductModifyOrReplaceForm
              location={{ ...location, product: localProduct, currentQuantity: parseInt(localCurrentQuantity) || 0 }}
              availableProducts={availableProducts}
              onComplete={handleProductModifyOrReplaceComplete}
              onCancel={() => setIsProductModifyModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </form>
  )
}
