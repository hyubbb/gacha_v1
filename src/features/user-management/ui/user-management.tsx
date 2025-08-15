'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Switch } from '@/shared/ui/switch'
import { Users, Settings, Plus, Edit, Trash2, Shield, Store, Calendar, Mail, Phone } from 'lucide-react'
import { useToast } from '@/shared/hooks/use-toast'
import { User } from '@/entities/user/model'

interface UserManagementProps {
  userRole: 'admin' | 'branch'
}

// Mock 사용자 데이터
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '김관리자',
    email: 'admin@company.com',
    role: 'admin',
    permissions: ['user_manage', 'product_manage', 'slot_manage', 'display_manage', 'system_config'],
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2024-12-20')
  },
  {
    id: 'user-2',
    name: '박지점장',
    email: 'branch1@company.com',
    role: 'branch',
    storeId: 'store-001',
    storeName: '강남점',
    permissions: ['product_manage', 'slot_manage', 'display_manage'],
    createdAt: new Date('2024-02-01'),
    lastLoginAt: new Date('2024-12-19')
  },
  {
    id: 'user-3',
    name: '이담당자',
    email: 'branch2@company.com',
    role: 'branch',
    storeId: 'store-002',
    storeName: '홍대점',
    permissions: ['product_manage', 'slot_manage'],
    createdAt: new Date('2024-03-01'),
    lastLoginAt: new Date('2024-12-18')
  },
  {
    id: 'user-4',
    name: '최직원',
    email: 'staff@company.com',
    role: 'branch',
    storeId: 'store-003',
    storeName: '명동점',
    permissions: ['product_view', 'slot_view'],
    createdAt: new Date('2024-04-01'),
    lastLoginAt: new Date('2024-12-17')
  }
]

const availablePermissions = [
  { id: 'user_manage', name: '사용자 관리', description: '사용자 계정 생성, 수정, 삭제' },
  { id: 'product_manage', name: '상품 관리', description: '상품 등록, 수정, 삭제' },
  { id: 'slot_manage', name: '슬롯 관리', description: '슬롯 위치 설정 및 관리' },
  { id: 'display_manage', name: '전시 관리', description: '상품 전시 할당 및 관리' },
  { id: 'system_config', name: '시스템 설정', description: '시스템 전반 설정 변경' },
  { id: 'product_view', name: '상품 조회', description: '상품 정보 조회만 가능' },
  { id: 'slot_view', name: '슬롯 조회', description: '슬롯 정보 조회만 가능' }
]

const storeOptions = [
  { id: 'store-001', name: '강남점' },
  { id: 'store-002', name: '홍대점' },
  { id: 'store-003', name: '명동점' },
  { id: 'store-004', name: '신촌점' },
  { id: 'store-005', name: '이대점' }
]

export function UserManagement({ userRole }: UserManagementProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'branch' as 'admin' | 'branch',
    storeId: '',
    permissions: [] as string[]
  })

  const [filters, setFilters] = useState({
    role: 'all',
    store: 'all',
    status: 'all'
  })

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === 'all' || user.role === filters.role
    const matchesStore = filters.store === 'all' || user.storeId === filters.store
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.lastLoginAt && 
       new Date().getTime() - user.lastLoginAt.getTime() < 30 * 24 * 60 * 60 * 1000) ||
      (filters.status === 'inactive' && (!user.lastLoginAt || 
       new Date().getTime() - user.lastLoginAt.getTime() >= 30 * 24 * 60 * 60 * 1000))
    
    return matchesRole && matchesStore && matchesStatus
  })

  // 새 사용자 생성
  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        storeId: newUser.role === 'branch' ? newUser.storeId : undefined,
        storeName: newUser.role === 'branch' ? storeOptions.find(s => s.id === newUser.storeId)?.name : undefined,
        permissions: newUser.permissions,
        createdAt: new Date(),
        lastLoginAt: undefined
      }

      setUsers(prev => [...prev, user])
      
      toast({
        title: '사용자 생성 완료',
        description: `${user.name} 사용자가 성공적으로 생성되었습니다.`,
      })

      // 폼 초기화
      setNewUser({
        name: '',
        email: '',
        role: 'branch',
        storeId: '',
        permissions: []
      })
      setIsAddUserModalOpen(false)
    }
  }

  // 사용자 편집
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditUserModalOpen(true)
  }

  // 사용자 저장
  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u))
      
      toast({
        title: '사용자 수정 완료',
        description: '사용자 정보가 성공적으로 수정되었습니다.',
      })
      
      setEditingUser(null)
      setIsEditUserModalOpen(false)
    }
  }

  // 사용자 삭제 확인
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setIsDeleteConfirmOpen(true)
  }

  // 사용자 삭제 실행
  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      
      toast({
        title: '사용자 삭제 완료',
        description: `${userToDelete.name} 사용자가 성공적으로 삭제되었습니다.`,
      })
      
      setUserToDelete(null)
      setIsDeleteConfirmOpen(false)
    }
  }

  // 권한 토글
  const togglePermission = (userId: string, permissionId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const hasPermission = user.permissions.includes(permissionId)
        return {
          ...user,
          permissions: hasPermission 
            ? user.permissions.filter(p => p !== permissionId)
            : [...user.permissions, permissionId]
        }
      }
      return user
    }))
  }

  // 통계 정보
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const branchUsers = users.filter(u => u.role === 'branch').length
  const activeUsers = users.filter(u => 
    u.lastLoginAt && 
    new Date().getTime() - u.lastLoginAt.getTime() < 30 * 24 * 60 * 60 * 1000
  ).length

  // 권한 설명 가져오기
  const getPermissionDescription = (permissionId: string) => {
    return availablePermissions.find(p => p.id === permissionId)?.description || ''
  }

  // 사용자 상태 확인
  const getUserStatus = (user: User) => {
    if (!user.lastLoginAt) return 'inactive'
    const daysSinceLastLogin = (new Date().getTime() - user.lastLoginAt.getTime()) / (24 * 60 * 60 * 1000)
    if (daysSinceLastLogin < 7) return 'active'
    if (daysSinceLastLogin < 30) return 'recent'
    return 'inactive'
  }

  if (userRole !== 'admin') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              접근 제한
            </CardTitle>
            <CardDescription>
              사용자 관리 기능에 접근할 권한이 없습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              관리자 권한이 필요합니다.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">관리자</p>
                <p className="text-2xl font-bold">{adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">지점 사용자</p>
                <p className="text-2xl font-bold">{branchUsers}</p>
              </div>
              <Store className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                사용자 관리
              </CardTitle>
              <CardDescription>
                시스템 사용자 계정을 관리하세요
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddUserModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              새 사용자
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 필터 */}
          <div className="flex gap-4 mb-4">
            <div>
              <Label>역할</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="branch">지점</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>지점</Label>
              <Select value={filters.store} onValueChange={(value) => setFilters(prev => ({ ...prev, store: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지점</SelectItem>
                  {storeOptions.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>상태</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 사용자 목록 테이블 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 정보</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>지점</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role === 'admin' ? '관리자' : '지점'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.storeName || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {availablePermissions.find(p => p.id === permission)?.name || permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      getUserStatus(user) === 'active' ? 'default' :
                      getUserStatus(user) === 'recent' ? 'secondary' : 'outline'
                    }>
                      {getUserStatus(user) === 'active' ? '활성' :
                       getUserStatus(user) === 'recent' ? '최근' : '비활성'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt ? (
                      <div className="text-sm">
                        <p>{user.lastLoginAt.toLocaleDateString()}</p>
                        <p className="text-gray-500">{user.lastLoginAt.toLocaleTimeString()}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">로그인 기록 없음</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              조건에 맞는 사용자가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 새 사용자 추가 모달 */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 사용자 추가</DialogTitle>
            <DialogDescription>새로운 사용자 계정을 생성하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>이름</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="사용자 이름"
                />
              </div>

              <div>
                <Label>이메일</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="이메일 주소"
                />
              </div>

              <div>
                <Label>역할</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as 'admin' | 'branch' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">관리자</SelectItem>
                    <SelectItem value="branch">지점</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newUser.role === 'branch' && (
                <div>
                  <Label>지점</Label>
                  <Select value={newUser.storeId} onValueChange={(value) => setNewUser(prev => ({ ...prev, storeId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="지점 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeOptions.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <Label>권한 설정</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Switch
                      checked={newUser.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewUser(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission.id]
                          }))
                        } else {
                          setNewUser(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission.id)
                          }))
                        }
                      }}
                    />
                    <Label className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateUser} className="flex-1">사용자 생성</Button>
              <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>취소</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 편집 모달 */}
      <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>사용자 정보 수정</DialogTitle>
            <DialogDescription>사용자 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>이름</Label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>

                <div>
                  <Label>이메일</Label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>

                <div>
                  <Label>역할</Label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value as 'admin' | 'branch' } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">관리자</SelectItem>
                      <SelectItem value="branch">지점</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingUser.role === 'branch' && (
                  <div>
                    <Label>지점</Label>
                    <Select value={editingUser.storeId || ''} onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, storeId: value } : null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="지점 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {storeOptions.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label>권한 설정</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => togglePermission(editingUser.id, permission.id)}
                      />
                      <Label className="text-sm">
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveUser} className="flex-1">저장</Button>
                <Button variant="outline" onClick={() => setIsEditUserModalOpen(false)}>취소</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 사용자 삭제 확인 모달 */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 삭제 확인</DialogTitle>
            <DialogDescription>
              정말로 {userToDelete?.name} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={confirmDeleteUser}>
              삭제
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
