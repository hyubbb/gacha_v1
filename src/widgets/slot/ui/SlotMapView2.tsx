'use client';

import { useState, useEffect, useMemo } from 'react';
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
import {
  clampInt,
  getStoreDisplayName,
  hasAvailableSlots
} from '@/modules/slot/lib/utils/utils';
import type { Layer, SelectedCell, SlotProduct } from '@/modules/slot/lib';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import {
  coinNotSlotModalAtom,
  slotListAtom,
  slotLocationAtom
} from '@/modules/slot/jotai/atom';
import { selectedStockProductAtom } from '@/modules/product/jotai/atom';
import { miniToastAtom } from '@/shared/jotai/atom';
import { ProductAddButton } from '@/shared/ui/components/buttons/ProductAddButton';
import { SlotAvailabilityStatus } from '@/modules/slot/components/SlotMap';
import { GridMap } from '@/modules/slot/components/grid/GridMap';

interface SlotMapViewProps {
  userRole: 'admin' | 'branch';
  currentStore: string;
}

// Main component
export function SlotMapView2({ userRole, currentStore }: SlotMapViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status =
    (searchParams.get('status') as 'view' | 'add' | 'old' | 'empty') || null;
  const { toast } = useToast();
  const { userRole: hookUserRole, isAdmin, updateRole } = useRole();
  const { refreshData } = useSlotMapData();

  const [parentLocations, setParentLocations] = useAtom(slotListAtom);
  const [locations, setLocations] = useAtom(slotLocationAtom);
  const [selectedStockProduct, setSelectedStockProduct] = useAtom(
    selectedStockProductAtom
  );
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [coinNotSlotModal, setCoinNotSlotModal] = useAtom(coinNotSlotModalAtom);
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

  // 부모 위치의 ID를 row-col 형식으로 반환
  const getParentId = (row: number, col: number) => {
    return `${row}-${col}`;
  };

  const getLocationsInCell = (row: number, col: number) => {
    return locations.filter(
      (location) => location.row === row && location.col === col
    );
  };

  const currentCellLocations = useMemo(
    () =>
      selectedLocationCell
        ? getLocationsInCell(selectedLocationCell.row, selectedLocationCell.col)
        : [],
    [selectedLocationCell]
  );
  const currentParentLocation = useMemo(
    () =>
      selectedLocationCell
        ? getParentLocation(selectedLocationCell.row, selectedLocationCell.col)
        : null,
    [selectedLocationCell]
  );

  // Event handlers
  const handleLocationCellClick = (row: number, col: number) => {
    setSelectedLocationCell({ row, col });
  };

  const handleAddParentLocation = (row: number, col: number) => {
    const newParentLocation: ParentLocation = {
      id: getParentId(row, col),
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
    // 부모 위치 ID를 row-col 형식으로 변환
    const parentId = getParentId(parentLocation.row, parentLocation.col);

    // 해당 층에 이미 위치가 존재하는지 확인
    const exists = locations.some(
      (l) => l.parentId === parentId && l.layer === layer && l.product
    );
    if (exists) {
      toast({
        title: '중복 위치',
        description: '해당 층에 이미 위치가 존재합니다.',
        variant: 'destructive'
      });
      return;
    }

    // todo: 슬롯의 가격은 제품을 넣는다고 해서 수정할 필요없이 그냥 슬롯에 product부분에 제품이 들어가기만하면되는거아님?

    // const newLocation: Slot = {
    //   id: `${parentId}-${LAYER_NUMBERS[layer]}`,
    //   parentId: parentId,
    //   row: parentLocation.row,
    //   col: parentLocation.col,
    //   layer,
    //   price: selectedStockProduct?.price || 10,
    //   maxQuantity: selectedStockProduct?.quantity || 10,
    //   currentQuantity: selectedStockProduct?.quantity || 10,
    //   status: 'active',
    //   product: selectedStockProduct || undefined
    // };

    const newLocationProducts = locations.map((l) => {
      if (l.parentId === parentId && l.layer === layer) {
        return {
          ...l,
          product: selectedStockProduct || undefined
        };
      }
      return l;
    });

    setMiniToast({
      open: true,
      message: '상품이 등록되었습니다.',
      onClose: () => {
        setSelectedLocationCell(null);
        setLocations(newLocationProducts);
        router.push(`/display`);
      },
      position: 'top',
      time: 2000
    });
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
      // 부모 위치 ID를 row-col 형식으로 설정
      const newParentLocation = {
        ...updatedParentLocation,
        id: getParentId(updatedParentLocation.row, updatedParentLocation.col)
      };
      // addMockParentLocation(newParentLocation);
      setParentLocations((prev) => [...prev, newParentLocation]);

      // 새로운 부모 위치 생성 시 상단, 중단, 하단 slotLocation도 함께 생성
      const parentId = getParentId(
        updatedParentLocation.row,
        updatedParentLocation.col
      );
      const newLocations: Slot[] = LAYER_NAMES.map((layerName) => ({
        id: `${parentId}-${LAYER_NUMBERS[layerName]}`,
        parentId: parentId,
        row: updatedParentLocation.row,
        col: updatedParentLocation.col,
        layer: layerName,
        price: 0, // 기본값 0, 사용자가 설정할 수 있음
        maxQuantity: DEFAULT_MAX_QUANTITY,
        currentQuantity: 0,
        status: 'active'
      }));

      // 새로운 위치들을 locations atom에 추가
      setLocations((prev) => [...prev, ...newLocations]);

      toast({
        title: '저장 완료',
        description: '부모 위치와 상단/중단/하단 위치가 생성되었습니다.'
      });
    } else {
      // 부모 위치 수정 시 ID를 row-col 형식으로 설정
      const updatedParentWithNewId = {
        ...updatedParentLocation,
        id: getParentId(updatedParentLocation.row, updatedParentLocation.col)
      };

      // 기존 부모 위치와 연결된 location들의 parentId 업데이트
      if (
        editingParentLocation &&
        editingParentLocation.id !== updatedParentWithNewId.id
      ) {
        const oldParentId = editingParentLocation.id;
        const newParentId = updatedParentWithNewId.id;

        setLocations((prev) =>
          prev.map((location) => {
            if (location.parentId === oldParentId) {
              const layerNumber = LAYER_NUMBERS[location.layer];
              return {
                ...location,
                id: `${newParentId}-${layerNumber}`,
                parentId: newParentId
              };
            }
            return location;
          })
        );
      }

      // 부모 위치 업데이트
      setParentLocations((prev) =>
        prev.map((parent) =>
          parent.id === editingParentLocation?.id
            ? updatedParentWithNewId
            : parent
        )
      );

      toast({
        title: '저장 완료',
        description: '부모 위치 정보가 저장되었습니다.'
      });
    }

    refreshData();
    setEditingParentLocation(null);
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

  // 상품 할당 취소
  const handleProductAssignmentCancel = () => {
    setIsAssignProductModalOpen(false);
    setCurrentLocationForAssignment(null);
  };

  useEffect(() => {
    const isAvailable = hasAvailableSlots(
      locations,
      selectedStockProduct?.price
    );
    if (status === 'add' && !isAvailable) {
      setCoinNotSlotModal({
        open: true,
        onClick: () => {},
        product: undefined
      });
    }
  }, [status, locations, selectedStockProduct]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>위치 맵 관리</span>
          </CardTitle>
          <CardDescription>
            {getStoreDisplayName(currentStore)} 위치 배치 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
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
      </Card> */}

      <section className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/display')}>
          display
        </Button>
        <Button variant="outline" onClick={() => router.push('/display/slot')}>
          display/slot
        </Button>
        <Button variant="outline" onClick={() => router.push('/product')}>
          product
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/display/slot-demo')}
        >
          display/slot-demo
        </Button>
      </section>

      {/* Location Map */}
      <GridMap
        mapSize={mapSize}
        selectedLocationCell={selectedLocationCell}
        selectedStockProduct={selectedStockProduct}
        status={status}
        getLocationsInCell={getLocationsInCell}
        getParentLocation={getParentLocation}
        isAdmin={isAdmin}
        handleLocationCellClick={handleLocationCellClick}
      />

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
                isNew={
                  !parentLocations.some(
                    (p) => p.id === editingParentLocation.id
                  )
                }
                onSave={handleUpdateParentLocation}
                onCancel={() => setEditingParentLocation(null)}
                onDelete={handleDeleteParentLocation}
              />
            ) : status === 'view' ? (
              <LocationDetailsView2
                selectedStockProduct={selectedStockProduct}
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
            ) : (
              <LocationDetailsView
                selectedStockProduct={selectedStockProduct}
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

      {/* 상품 등록 버튼 */}
      <ProductAddButton onClick={() => router.push('/product')} />

      {/* 상품 할당 모달 */}
      {/* {currentLocationForAssignment && (
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
              isNew={!currentLocationForAssignment.product}
            />
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
}

// Location details 수정중인 컴포넌트
const LocationDetailsView = ({
  selectedStockProduct,
  selectedLocationCell,
  currentParentLocation,
  currentCellLocations,
  onAddParentLocation,
  onEditParentLocation,
  onCreateLocationAndAssignProduct,
  onEditLocation
}: {
  selectedStockProduct: SlotProduct | null;
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
  <div className="space-y-4">
    {/* 층별 위치 정보 */}
    {currentParentLocation && (
      <>
        {LAYER_NAMES.map((layerName) => {
          const location = currentCellLocations.find(
            (s) => s.layer === layerName
          );
          const layerKorean = LAYER_KOREAN[layerName];

          return (
            <Card key={layerName} className="gap-0 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                  {layerKorean}층 ({LAYER_NUMBERS[layerName]})
                </h4>
                <div className="flex space-x-2">
                  {!location?.product &&
                    location?.price === selectedStockProduct?.price && (
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
                        <Plus className="mr-1 h-4 w-4" /> 상품 등록
                      </Button>
                    )}
                </div>
              </div>
              {location?.product ? (
                <LocationInfo location={location} />
              ) : location?.price === selectedStockProduct?.price ? (
                <p className="text-gray-500">상품 등록이 가능한 위치입니다.</p>
              ) : (
                <p className="text-gray-500">
                  코인이 달라서 등록이 불가능한 위치입니다.
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
  selectedStockProduct,
  selectedLocationCell,
  currentParentLocation,
  currentCellLocations,
  onAddParentLocation,
  onEditParentLocation,
  onCreateLocationAndAssignProduct,
  onEditLocation
}: {
  selectedStockProduct: SlotProduct | null;
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
  const [layerPrices, setLayerPrices] = useState({
    top: 0,
    middle: 0,
    bottom: 0
  });

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

      {/* 층별 금액 설정 */}
      <div className="space-y-3">
        <Label className="text-base font-medium">층별 금액 설정</Label>
        <div className="grid grid-cols-3 gap-4">
          {LAYER_NAMES.map((layerName) => (
            <div key={layerName} className="space-y-2">
              <Label htmlFor={`price-${layerName}`}>
                {LAYER_KOREAN[layerName]}층 금액
              </Label>
              <Input
                id={`price-${layerName}`}
                type="number"
                value={layerPrices[layerName]}
                onChange={(e) =>
                  setLayerPrices((prev) => ({
                    ...prev,
                    [layerName]: parseInt(e.target.value) || 0
                  }))
                }
                placeholder="0"
                min="0"
              />
            </div>
          ))}
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
