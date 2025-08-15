'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Plus, Edit, Trash2, Shield, Store } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UserManagementProps {
  userRole: 'admin' | 'branch'
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'branch'
  storeId?: string
  storeName?: string
  status: 'active' | 'inactive'
  lastLogin: Date
  createdAt: Date
}

export default function UserManagement({ userRole }: UserManagementProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: '김관리',
      email: 'admin@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date('2024-01-07'),
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'user-2',
      name: '이지점',
      email: 'gangnam@company.com',
      role: 'branch',
      storeId: 'store-001',
      storeName: '강남점',
      status: 'active',
      lastLogin: new Date('2024-01-06'),
      createdAt: new Date('2024-01-02')
    },
    {
      id: 'user-3',
      name: '박담당',
      email: 'hongdae@company.com',
      role: 'branch',
      storeId: 'store-002',
      storeName: '홍대점',
      status: 'active',
      lastLogin: new Date('2024-01-05'),
      createdAt: new Date('2024-01-03')
    }
  ])

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'branch' as 'admin' | 'branch',
    storeId: ''
  })

  const stores = [
    { id: 'store-001', name: '강남점' },
    { id: 'store-002', name: '홍대점' },
    { id: 'store-003', name: '명동점' }
  ]

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: '입력 오류',
        description: '이름과 이메일은 필수 입력 항목입니다.',
        variant: 'destructive'
      })
      return
    }

    if (newUser.role === 'branch' && !newUser.storeId) {
      toast({
        title: '입력 오류',
        description: '지점 담당자는 담당 지점을 선택해야 합니다.',
        variant: 'destructive'
      })
      return
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      storeId: newUser.role === 'branch' ? newUser.storeId : undefined,
      storeName: newUser.role === 'branch' ? stores.find(s => s.id === newUser.storeId)?.name : undefined,
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date()
    }

    setUsers([...users, user])
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', role: 'branch', storeId: '' })

    toast({
      title: '사용자 추가 완료',
      description: `${newUser.name}님이 성공적으로 추가되었습니다.`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
    toast({
      title: '사용자 삭제 완료',
      description: '사용자가 성공적으로 삭제되었습니다.',
    })
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">접근 권한이 없습니다</h3>
          <p className="text-gray-500">사용자 관리는 관리자만 접근할 수 있습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>사용자 관리</span>
              </CardTitle>
              <CardDescription>
                시스템 사용자를 관리하고 권한을 설정합니다.
              </CardDescription>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  사용자 추가
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 사용자 추가</DialogTitle>
                  <DialogDescription>
                    새로운 사용자를 시스템에 추가합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-name">이름</Label>
                    <Input
                      id="user-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="사용자 이름"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-email">이메일</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">역할</Label>
                    <Select value={newUser.role} onValueChange={(value: 'admin' | 'branch') => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="branch">지점 담당자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.role === 'branch' && (
                    <div>
                      <Label htmlFor="user-store">담당 지점</Label>
                      <Select value={newUser.storeId} onValueChange={(value) => setNewUser({ ...newUser, storeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="지점을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddUser}>
                      추가
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Store className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? '관리자' : '지점 담당자'}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status === 'active' ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.storeName && (
                          <p className="text-sm text-gray-500">담당: {user.storeName}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          최근 로그인: {user.lastLogin.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? '비활성화' : '활성화'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 사용자 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">관리자</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">지점 담당자</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'branch').length}</p>
              </div>
              <Store className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
