'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/shadcn/card';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Plus, Settings, Package, Edit, AlertCircle } from 'lucide-react';
import { useToast, useRole } from '@/shared/hooks';
import {
  getMockLocations,
  getMockParentLocations,
  updateMockLocation,
  updateMockParentLocation,
  addMockParentLocation,
  deleteMockParentLocation,
  addMockLocation,
  deleteMockLocation
} from '@/modules/slot/api/mock-data';
import { getMockProducts } from '@/modules/product2/api/mock-data';
import { Product, ParentLocation, Slot } from '@/shared/lib';
import { ProductRegisterAssignForm } from '@/modules/slot/components/form/ProductRegisterAssignForm';
import { ProductModifyForm } from '@/modules/slot/components/form/ProductModifyForm';

// Import extracted components, hooks, and utilities
import {
  LAYER_NAMES,
  LAYER_KOREAN,
  LAYER_NUMBERS,
  MAX_QUANTITY,
  MIN_QUANTITY,
  DEFAULT_MAX_QUANTITY
} from '@/modules/slot/lib/constants';
import { useSlotMapData, useSlotMapState } from '@/modules/slot/hooks';
import {
  MapLegend,
  MapControls,
  MapCell,
  LocationInfo,
  EditLocationForm
} from '@/modules/slot/components';
import { clampInt, getStoreDisplayName } from '@/modules/slot/lib/utils/utils';
import type { Layer, SelectedCell } from '@/modules/slot/lib';
import { useRouter, useSearchParams } from 'next/navigation';

interface SlotMapViewProps {
  userRole: 'admin' | 'branch';
  currentStore: string;
  status?: 'view' | 'add';
}

// Main component
export function SlotMapView2({ userRole, currentStore }: SlotMapViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'view';
  const { toast } = useToast();
  const { userRole: hookUserRole, isAdmin, updateRole } = useRole();
  const { parentLocations, locations, refreshData } = useSlotMapData();
  const {
    mapSize,
    setMapSize,
    selectedLocationCell,
    setSelectedLocationCell,
    editingLocation,
    setEditingLocation,
    editingParentLocation,
    setEditingParentLocation,
    isAssignProductModalOpen,
    setIsAssignProductModalOpen,
    currentLocationForAssignment,
    setCurrentLocationForAssignment
  } = useSlotMapState();

  const availableProducts: Product[] = getMockProducts();

  // Helper functions
  const getParentLocation = (row: number, col: number) => {
    return parentLocations.find((ps) => ps.row === row && ps.col === col);
  };

  const getLocationsInCell = (row: number, col: number) => {
    return locations.filter(
      (location) => location.row === row && location.col === col
    );
  };

  // Event handlers
  const handleLocationCellClick = (row: number, col: number) => {
    setSelectedLocationCell({ row, col });
  };

  const handleAddParentLocation = (row: number, col: number) => {
    const newParentLocation: ParentLocation = {
      id: `TEMP-${Date.now()}`,
      row,
      col,
      name: ''
    };
    setEditingParentLocation(newParentLocation);
  };

  const handleCreateLocationAndAssignProduct = (
    parentLocation: ParentLocation,
    layer: Layer
  ) => {
    const exists = getMockLocations().some(
      (l) => l.parentId === parentLocation.id && l.layer === layer
    );
    if (exists) {
      toast({
        title: '중복 위치',
        description: '해당 층에 이미 위치가 존재합니다.',
        variant: 'destructive'
      });
      return;
    }

    const newLocation: Slot = {
      id: `TEMP-${Date.now()}`,
      parentId: parentLocation.id,
      row: parentLocation.row,
      col: parentLocation.col,
      layer,
      price: 0,
      maxQuantity: DEFAULT_MAX_QUANTITY,
      currentQuantity: 0,
      status: 'active'
    };
    setCurrentLocationForAssignment(newLocation);
    setIsAssignProductModalOpen(true);
  };

  const handleUpdateParentLocation = (
    updatedParentLocation: ParentLocation,
    isNew: boolean
  ) => {
    const existing = getMockParentLocations();
    const isIdConflict = existing.some(
      (ps) =>
        ps.id === updatedParentLocation.id &&
        (!editingParentLocation || ps.id !== editingParentLocation.id)
    );

    if (isIdConflict) {
      toast({
        title: 'ID 중복',
        description: `부모 위치 ID '${updatedParentLocation.id}'는 이미 사용 중입니다.`,
        variant: 'destructive'
      });
      return;
    }

    if (isNew) {
      addMockParentLocation(updatedParentLocation);
    } else {
      if (
        editingParentLocation &&
        editingParentLocation.id !== updatedParentLocation.id
      ) {
        const oldParentId = editingParentLocation.id;
        const newParentId = updatedParentLocation.id;
        getMockLocations().forEach((location) => {
          if (location.parentId === oldParentId) {
            const layerNumber = LAYER_NUMBERS[location.layer];
            updateMockLocation({
              ...location,
              id: `${newParentId}-${layerNumber}`,
              parentId: newParentId
            });
          }
        });
      }
      updateMockParentLocation(updatedParentLocation);
    }

    refreshData();
    setEditingParentLocation(null);
    toast({
      title: '저장 완료',
      description: '부모 위치 정보가 저장되었습니다.'
    });
  };

  const handleUpdateLocation = (updatedLocation: Slot) => {
    const fixed = {
      ...updatedLocation,
      maxQuantity: clampInt(
        updatedLocation.maxQuantity,
        MIN_QUANTITY,
        MAX_QUANTITY
      )
    };
    updateMockLocation(fixed);
    refreshData();
    setEditingLocation(null);
    toast({
      title: '위치 업데이트 완료',
      description: `위치 ${fixed.id} 정보가 저장되었습니다.`
    });
  };

  const handleDeleteLocation = (locationId: string) => {
    if (!confirm(`정말 위치 ${locationId}을(를) 삭제하시겠습니까?`)) return;
    deleteMockLocation(locationId);
    refreshData();
    setEditingLocation(null);
    toast({
      title: '삭제 완료',
      description: `위치 ${locationId}이(가) 삭제되었습니다.`
    });
  };

  const handleDeleteParentLocation = (parentLocationId: string) => {
    if (
      !confirm(
        `정말 부모 위치 ${parentLocationId} 및 하위 위치를 모두 삭제하시겠습니까?`
      )
    )
      return;
    deleteMockParentLocation(parentLocationId);
    refreshData();
    setEditingParentLocation(null);
    setSelectedLocationCell(null);
    toast({
      title: '삭제 완료',
      description: `부모 위치 ${parentLocationId} 및 관련 위치가 삭제되었습니다.`
    });
  };

  const handleProductAssignmentComplete = (
    updatedLocation: Slot,
    isNewLocation: boolean
  ) => {
    const fixed = {
      ...updatedLocation,
      maxQuantity: clampInt(
        updatedLocation.maxQuantity,
        MIN_QUANTITY,
        MAX_QUANTITY
      )
    };
    if (isNewLocation) addMockLocation(fixed);
    else updateMockLocation(fixed);

    setIsAssignProductModalOpen(false);
    setCurrentLocationForAssignment(null);
    refreshData();
    toast({
      title: '상품 할당 완료',
      description: `${fixed.product?.name}이(가) 위치 ${fixed.row},${fixed.col} (${LAYER_KOREAN[fixed.layer]})에 할당되었습니다.`
    });
  };

  const handleProductAssignmentCancel = () => {
    setIsAssignProductModalOpen(false);
    setCurrentLocationForAssignment(null);
  };

  const currentCellLocations = selectedLocationCell
    ? getLocationsInCell(selectedLocationCell.row, selectedLocationCell.col)
    : [];
  const currentParentLocation = selectedLocationCell
    ? getParentLocation(selectedLocationCell.row, selectedLocationCell.col)
    : null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>위치 맵 관리</span>
          </CardTitle>
          <CardDescription>
            {getStoreDisplayName(currentStore)} 위치 배치 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 역할 선택 */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="role-select">사용자 역할:</Label>
              <select
                id="role-select"
                value={hookUserRole}
                onChange={(e) =>
                  updateRole(e.target.value as 'admin' | 'branch')
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="admin">관리자</option>
                <option value="branch">지점 담당자</option>
              </select>
            </div>
            <Badge variant={isAdmin ? 'default' : 'secondary'}>
              {isAdmin ? '전체 슬롯 표시' : '부모 위치가 있는 슬롯만 표시'}
            </Badge>
          </div>

          <MapControls mapSize={mapSize} setMapSize={setMapSize} />
          <MapLegend />
        </CardContent>
      </Card>

      <section className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/display')}>
          display
        </Button>
        <Button variant="outline" onClick={() => router.push('/display/slot')}>
          display/slot
        </Button>
      </section>

      {/* Location Map */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-scroll">
            <div
              className="grid min-w-max gap-3"
              style={{
                gridTemplateColumns: `repeat(${mapSize.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${mapSize.rows}, minmax(0, 1fr))`
              }}
            >
              {Array.from(
                { length: mapSize.rows * mapSize.cols },
                (_, index) => {
                  const row = Math.floor(index / mapSize.cols);
                  const col = index % mapSize.cols;
                  const cellLocations = getLocationsInCell(row, col);
                  const parentLocation = getParentLocation(row, col);

                  // admin이 아닐 때는 부모 위치 정보가 있는 슬롯만 보이도록 처리
                  // 현재 status가 add상태일땐 상품 재고 빈곳을 찾는거라서 부모 정보가 있는 슬롯만 보이도록 처리

                  const shouldShow =
                    status === 'add'
                      ? !!parentLocation
                      : isAdmin || !!parentLocation;

                  const isInvisible = !shouldShow;

                  return (
                    <MapCell
                      key={`${row}-${col}`}
                      row={row}
                      col={col}
                      cellLocations={cellLocations}
                      parentLocation={parentLocation}
                      isSelected={
                        selectedLocationCell?.row === row &&
                        selectedLocationCell?.col === col
                      }
                      onClick={() => handleLocationCellClick(row, col)}
                      className={isInvisible ? 'invisible' : ''}
                    />
                  );
                }
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details Dialog */}
      {/* 상품 할당 모달 */}
      {selectedLocationCell && (
        <Dialog
          open={!!selectedLocationCell}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedLocationCell(null);
              setEditingLocation(null);
              setEditingParentLocation(null);
            }
          }}
        >
          <DialogContent className="w-[90%] max-w-3xl">
            <DialogHeader>
              <DialogTitle>상품 등록</DialogTitle>
              <DialogDescription>
                위치: ({selectedLocationCell.row}, {selectedLocationCell.col})
                {currentParentLocation &&
                  ` - ${currentParentLocation.name || '이름 없음'}`}
              </DialogDescription>
            </DialogHeader>

            {editingLocation ? (
              <EditLocationForm
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
              <LocationDetailsView
                selectedLocationCell={selectedLocationCell}
                currentParentLocation={currentParentLocation || null}
                currentCellLocations={currentCellLocations}
                onAddParentLocation={() =>
                  handleAddParentLocation(
                    selectedLocationCell.row,
                    selectedLocationCell.col
                  )
                }
                onEditParentLocation={() => {
                  if (currentParentLocation) {
                    setEditingParentLocation(currentParentLocation);
                  }
                }}
                onCreateLocationAndAssignProduct={
                  handleCreateLocationAndAssignProduct
                }
                onEditLocation={setEditingLocation}
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* 상품 할당 모달 */}
      {currentLocationForAssignment && (
        <Dialog
          open={isAssignProductModalOpen}
          onOpenChange={setIsAssignProductModalOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>상품 할당</DialogTitle>
              <DialogDescription>
                좌표 {currentLocationForAssignment.row},
                {currentLocationForAssignment.col} (
                {LAYER_KOREAN[currentLocationForAssignment.layer]})에 상품을
                할당합니다.
              </DialogDescription>
            </DialogHeader>
            <ProductRegisterAssignForm
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
  );
}

// Location details view component
const LocationDetailsView = ({
  selectedLocationCell,
  currentParentLocation,
  currentCellLocations,
  onAddParentLocation,
  onEditParentLocation,
  onCreateLocationAndAssignProduct,
  onEditLocation
}: {
  selectedLocationCell: SelectedCell;
  currentParentLocation: ParentLocation | null;
  currentCellLocations: Slot[];
  onAddParentLocation: () => void;
  onEditParentLocation: () => void;
  onCreateLocationAndAssignProduct: (
    parentLocation: ParentLocation,
    layer: Layer
  ) => void;
  onEditLocation: (location: Slot) => void;
}) => (
  <div className="space-y-6">
    {/* 층별 위치 정보 */}
    {currentParentLocation && (
      <>
        {LAYER_NAMES.map((layerName) => {
          const location = currentCellLocations.find(
            (s) => s.layer === layerName
          );
          const layerKorean = LAYER_KOREAN[layerName];

          return (
            <Card key={layerName} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                  {layerKorean}층 ({LAYER_NUMBERS[layerName]})
                </h4>
                <div className="flex space-x-2">
                  {!location ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        currentParentLocation &&
                        onCreateLocationAndAssignProduct(
                          currentParentLocation,
                          layerName
                        )
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" /> 상품 할당
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditLocation(location)}
                    >
                      <Settings className="mr-1 h-4 w-4" /> 위치 수정
                    </Button>
                  )}
                </div>
              </div>
              {location ? (
                <LocationInfo location={location} />
              ) : (
                <p className="text-gray-500">
                  이 층에는 위치가 설정되지 않았습니다.
                </p>
              )}
            </Card>
          );
        })}
      </>
    )}
  </div>
);

const LocationDetailsView2 = ({
  selectedLocationCell,
  currentParentLocation,
  currentCellLocations,
  onAddParentLocation,
  onEditParentLocation,
  onCreateLocationAndAssignProduct,
  onEditLocation
}: {
  selectedLocationCell: SelectedCell;
  currentParentLocation: ParentLocation | null;
  currentCellLocations: Slot[];
  onAddParentLocation: () => void;
  onEditParentLocation: () => void;
  onCreateLocationAndAssignProduct: (
    parentLocation: ParentLocation,
    layer: Layer
  ) => void;
  onEditLocation: (location: Slot) => void;
}) => (
  <div className="space-y-6">
    {/* 부모 위치 정보 */}
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-semibold">부모 위치 정보</h4>
        <div className="flex space-x-2">
          {!currentParentLocation && (
            <Button size="sm" onClick={onAddParentLocation}>
              <Plus className="mr-1 h-4 w-4" /> 위치 추가
            </Button>
          )}
          {currentParentLocation && (
            <Button size="sm" variant="outline" onClick={onEditParentLocation}>
              <Settings className="mr-1 h-4 w-4" /> 위치 수정
            </Button>
          )}
        </div>
      </div>
      {currentParentLocation ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <Label>좌표</Label>
            <p className="font-medium">
              {currentParentLocation.row}, {currentParentLocation.col}
            </p>
          </div>
          <div>
            <Label>위치 이름</Label>
            <p className="font-medium">
              {currentParentLocation.name || '이름 없음'}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          이 위치에는 부모 위치가 설정되지 않았습니다.
        </p>
      )}
    </Card>

    {/* 층별 위치 정보 */}
    {currentParentLocation && (
      <>
        {LAYER_NAMES.map((layerName) => {
          const location = currentCellLocations.find(
            (s) => s.layer === layerName
          );
          const layerKorean = LAYER_KOREAN[layerName];

          return (
            <Card key={layerName} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                  {layerKorean}층 ({LAYER_NUMBERS[layerName]})
                </h4>
                <div className="flex space-x-2">
                  {!location ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        currentParentLocation &&
                        onCreateLocationAndAssignProduct(
                          currentParentLocation,
                          layerName
                        )
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" /> 상품 할당
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditLocation(location)}
                    >
                      <Settings className="mr-1 h-4 w-4" /> 위치 수정
                    </Button>
                  )}
                </div>
              </div>
              {location ? (
                <LocationInfo location={location} />
              ) : (
                <p className="text-gray-500">
                  이 층에는 위치가 설정되지 않았습니다.
                </p>
              )}
            </Card>
          );
        })}
      </>
    )}
  </div>
);

// 부모 위치 편집 폼
interface ParentLocationEditFormProps {
  parentLocation: ParentLocation;
  isNew: boolean;
  onSave: (updatedParentLocation: ParentLocation, isNew: boolean) => void;
  onCancel: () => void;
  onDelete: (parentLocationId: string) => void;
}

function ParentLocationEditForm({
  parentLocation,
  isNew,
  onSave,
  onCancel,
  onDelete
}: ParentLocationEditFormProps) {
  const [editId, setEditId] = useState(parentLocation.id);
  const [editName, setEditName] = useState(parentLocation.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        ...parentLocation,
        id: editId,
        name: editName
      },
      isNew
    );
  };

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
              if (
                confirm(
                  '정말 부모 위치를 삭제하시겠습니까? 관련된 위치도 모두 삭제됩니다.'
                )
              ) {
                onDelete(parentLocation.id);
              }
            }}
          >
            부모 위치 삭제
          </Button>
        )}
        <Button type="submit">{isNew ? '추가' : '저장'}</Button>
      </div>
    </form>
  );
}
