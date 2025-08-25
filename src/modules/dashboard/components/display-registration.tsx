'use client';

import { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/shadcn/select';
import { Badge } from '@/shared/ui/shadcn/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/shadcn/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';

import {
  Monitor,
  Package,
  MapPin,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { getMockProducts } from '@/modules/product2/api/mock-data';
import {
  getMockLocations,
  getMockParentLocations,
  updateMockLocation
} from '@/modules/slot/api/mock-data';
import { Product, ParentLocation, Slot } from '@/shared/lib';
import { DisplayRegistrationProps, DisplayAssignment } from '../model';

export function DisplayRegistration({
  userRole,
  currentStore
}: DisplayRegistrationProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(getMockProducts());
  const [locations, setLocations] = useState<Slot[]>(getMockLocations());
  const [parentLocations, setParentLocations] = useState<ParentLocation[]>(
    getMockParentLocations()
  );
  const [displayAssignments, setDisplayAssignments] = useState<
    DisplayAssignment[]
  >([]);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<DisplayAssignment | null>(null);

  const [newAssignment, setNewAssignment] = useState({
    productId: '',
    locationId: '',
    quantity: '',
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    location: 'all'
  });

  // 사용 가능한 위치들 (빈 위치 또는 상품이 있는 위치)
  const availableLocations = locations.filter(
    (location) =>
      location.status === 'active' &&
      (location.currentQuantity === 0 ||
        location.currentQuantity < location.maxQuantity)
  );

  // 사용 가능한 상품들 (재고가 있는 상품)
  const availableProducts = products.filter(
    (product) => product.quantity > 0 && product.status !== 'displayed'
  );

  // 필터링된 전시 할당 목록
  const filteredAssignments = displayAssignments.filter((assignment) => {
    const matchesStatus =
      filters.status === 'all' || assignment.status === filters.status;
    const matchesPriority =
      filters.priority === 'all' || assignment.priority === filters.priority;
    const matchesLocation =
      filters.location === 'all' || assignment.locationId === filters.location;

    return matchesStatus && matchesPriority && matchesLocation;
  });

  // 새 전시 할당 생성
  const handleCreateAssignment = () => {
    if (
      newAssignment.productId &&
      newAssignment.locationId &&
      newAssignment.quantity
    ) {
      const product = products.find((p) => p.id === newAssignment.productId);
      const location = locations.find((l) => l.id === newAssignment.locationId);

      if (product && location) {
        const assignment: DisplayAssignment = {
          id: `display-${Date.now()}`,
          productId: newAssignment.productId,
          productName: product.name,
          locationId: newAssignment.locationId,
          parentLocationName:
            parentLocations.find((pl) => pl.id === location.parentId)?.name ||
            location.parentId,
          layer: location.layer,
          quantity: parseInt(newAssignment.quantity),
          startDate: newAssignment.startDate,
          endDate: newAssignment.endDate,
          status: 'active',
          priority: newAssignment.priority
        };

        setDisplayAssignments((prev) => [...prev, assignment]);

        // 위치에 상품 할당
        const updatedLocation: Slot = {
          ...location,
          currentQuantity:
            location.currentQuantity + parseInt(newAssignment.quantity),
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            inStockDate: new Date()
          }
        };
        updateMockLocation(updatedLocation);
        setLocations(getMockLocations());

        // 상품 상태 업데이트
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, status: 'displayed' as const } : p
          )
        );

        toast({
          title: '전시 할당 완료',
          description: `${product.name}이(가) ${assignment.parentLocationName}의 ${location.layer} 층에 할당되었습니다.`
        });

        // 폼 초기화
        setNewAssignment({
          productId: '',
          locationId: '',
          quantity: '',
          startDate: new Date(),
          endDate: undefined,
          priority: 'medium'
        });
        setIsAssignmentModalOpen(false);
      }
    }
  };

  // 전시 할당 편집
  const handleEditAssignment = (assignment: DisplayAssignment) => {
    setEditingAssignment(assignment);
    setIsEditModalOpen(true);
  };

  // 전시 할당 저장
  const handleSaveAssignment = () => {
    if (editingAssignment) {
      setDisplayAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? editingAssignment : a))
      );

      toast({
        title: '전시 할당 수정 완료',
        description: '전시 할당 정보가 성공적으로 수정되었습니다.'
      });

      setEditingAssignment(null);
      setIsEditModalOpen(false);
    }
  };

  // 전시 할당 삭제
  const handleDeleteAssignment = (assignmentId: string) => {
    const assignment = displayAssignments.find((a) => a.id === assignmentId);
    if (assignment) {
      // 위치에서 상품 제거
      const location = locations.find((l) => l.id === assignment.locationId);
      if (location) {
        const updatedLocation: Slot = {
          ...location,
          currentQuantity: Math.max(
            0,
            location.currentQuantity - assignment.quantity
          ),
          product:
            location.currentQuantity - assignment.quantity <= 0
              ? undefined
              : location.product
        };
        updateMockLocation(updatedLocation);
        setLocations(getMockLocations());
      }

      // 상품 상태 복원
      setProducts((prev) =>
        prev.map((p) =>
          p.id === assignment.productId
            ? { ...p, status: 'in_stock' as const }
            : p
        )
      );

      // 할당 제거
      setDisplayAssignments((prev) =>
        prev.filter((a) => a.id !== assignmentId)
      );

      toast({
        title: '전시 할당 삭제 완료',
        description: '전시 할당이 성공적으로 삭제되었습니다.'
      });
    }
  };

  // 전시 할당 상태 변경
  const handleStatusChange = (
    assignmentId: string,
    newStatus: 'active' | 'scheduled' | 'ended'
  ) => {
    setDisplayAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: newStatus } : a))
    );
  };

  // 통계 정보
  const activeDisplays = displayAssignments.filter(
    (a) => a.status === 'active'
  ).length;
  const scheduledDisplays = displayAssignments.filter(
    (a) => a.status === 'scheduled'
  ).length;
  const totalDisplayValue = displayAssignments.reduce((sum, a) => {
    const product = products.find((p) => p.id === a.productId);
    return sum + (product ? product.price * a.quantity : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  총 전시 할당
                </p>
                <p className="text-2xl font-bold">
                  {displayAssignments.length}
                </p>
              </div>
              <Monitor className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 전시</p>
                <p className="text-2xl font-bold">{activeDisplays}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">예약 전시</p>
                <p className="text-2xl font-bold">{scheduledDisplays}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  총 전시 가치
                </p>
                <p className="text-2xl font-bold">
                  {totalDisplayValue.toLocaleString()}원
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 전시 할당 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                전시 할당 관리
              </CardTitle>
              <CardDescription>
                상품의 전시 위치를 관리하고 등록하세요
              </CardDescription>
            </div>
            <Button onClick={() => setIsAssignmentModalOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />새 전시 할당
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 필터 */}
          <div className="mb-4 flex gap-4">
            <div>
              <Label>상태</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="scheduled">예약</SelectItem>
                  <SelectItem value="ended">종료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>우선순위</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>위치</Label>
              <Select
                value={filters.location}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, location: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 위치</SelectItem>
                  {parentLocations.map((pl) => (
                    <SelectItem key={pl.id} value={pl.id}>
                      {pl.name || pl.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 전시 할당 테이블 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {assignment.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>
                        {assignment.parentLocationName} - {assignment.layer}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.quantity}</TableCell>
                  <TableCell>
                    {assignment.startDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {assignment.endDate
                      ? assignment.endDate.toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assignment.status === 'active'
                          ? 'default'
                          : assignment.status === 'scheduled'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {assignment.status === 'active'
                        ? '활성'
                        : assignment.status === 'scheduled'
                          ? '예약'
                          : '종료'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assignment.priority === 'high'
                          ? 'destructive'
                          : assignment.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {assignment.priority === 'high'
                        ? '높음'
                        : assignment.priority === 'medium'
                          ? '보통'
                          : '낮음'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAssignments.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              전시 할당이 없습니다. 새 전시 할당을 추가해보세요.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 새 전시 할당 모달 */}
      <Dialog
        open={isAssignmentModalOpen}
        onOpenChange={setIsAssignmentModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 전시 할당</DialogTitle>
            <DialogDescription>
              상품을 특정 위치에 전시하도록 할당하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>상품</Label>
                <Select
                  value={newAssignment.productId}
                  onValueChange={(value) =>
                    setNewAssignment((prev) => ({ ...prev, productId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상품 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (재고: {product.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>위치</Label>
                <Select
                  value={newAssignment.locationId}
                  onValueChange={(value) =>
                    setNewAssignment((prev) => ({ ...prev, locationId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="위치 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocations.map((location) => {
                      const parentLocation = parentLocations.find(
                        (pl) => pl.id === location.parentId
                      );
                      return (
                        <SelectItem key={location.id} value={location.id}>
                          {parentLocation?.name || location.parentId} -{' '}
                          {location.layer} 층 ({location.currentQuantity}/
                          {location.maxQuantity})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>수량</Label>
                <Input
                  type="number"
                  value={newAssignment.quantity}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      quantity: e.target.value
                    }))
                  }
                  placeholder="할당할 수량"
                />
              </div>

              <div>
                <Label>우선순위</Label>
                <Select
                  value={newAssignment.priority}
                  onValueChange={(value) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      priority: value as 'high' | 'medium' | 'low'
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>시작일</Label>
                <Input
                  type="date"
                  value={newAssignment.startDate.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      startDate: new Date(e.target.value)
                    }))
                  }
                />
              </div>

              <div>
                <Label>종료일 (선택사항)</Label>
                <Input
                  type="date"
                  value={
                    newAssignment.endDate
                      ? newAssignment.endDate.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      endDate: e.target.value
                        ? new Date(e.target.value)
                        : undefined
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAssignment} className="flex-1">
                할당 생성
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAssignmentModalOpen(false)}
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 전시 할당 편집 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>전시 할당 편집</DialogTitle>
            <DialogDescription>전시 할당 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          {editingAssignment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상품</Label>
                  <Input value={editingAssignment.productName} disabled />
                </div>

                <div>
                  <Label>위치</Label>
                  <Input
                    value={`${editingAssignment.parentLocationName} - ${editingAssignment.layer}`}
                    disabled
                  />
                </div>

                <div>
                  <Label>수량</Label>
                  <Input
                    type="number"
                    value={editingAssignment.quantity}
                    onChange={(e) =>
                      setEditingAssignment((prev) =>
                        prev
                          ? { ...prev, quantity: parseInt(e.target.value) || 0 }
                          : null
                      )
                    }
                  />
                </div>

                <div>
                  <Label>우선순위</Label>
                  <Select
                    value={editingAssignment.priority}
                    onValueChange={(value) =>
                      setEditingAssignment((prev) =>
                        prev
                          ? {
                              ...prev,
                              priority: value as 'high' | 'medium' | 'low'
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>상태</Label>
                  <Select
                    value={editingAssignment.status}
                    onValueChange={(value) =>
                      setEditingAssignment((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: value as 'active' | 'scheduled' | 'ended'
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="scheduled">예약</SelectItem>
                      <SelectItem value="ended">종료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={
                      editingAssignment.startDate.toISOString().split('T')[0]
                    }
                    onChange={(e) =>
                      setEditingAssignment((prev) =>
                        prev
                          ? { ...prev, startDate: new Date(e.target.value) }
                          : null
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label>종료일 (선택사항)</Label>
                <Input
                  type="date"
                  value={
                    editingAssignment.endDate
                      ? editingAssignment.endDate.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditingAssignment((prev) =>
                      prev
                        ? {
                            ...prev,
                            endDate: e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveAssignment} className="flex-1">
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
