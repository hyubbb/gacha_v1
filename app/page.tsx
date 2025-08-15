'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, MapPin, Search, Settings, Users, BarChart3 } from 'lucide-react'
import SlotMapView from '@/components/slot-map-view'
import ProductRegistration from '@/components/product-registration'
import ProductSearch from '@/components/product-search'
import DisplayRegistration from '@/components/display-registration'
import UserManagement from '@/components/user-management'

export default function ProductManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole, setUserRole] = useState<'admin' | 'branch'>('admin')
  const [currentStore, setCurrentStore] = useState('store-001')

  const stats = [
    {
      title: '총 상품 수',
      value: '1,234',
      description: '등록된 전체 상품',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: '활성 슬롯',
      value: '456',
      description: '현재 사용 중인 슬롯',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: '대기 상품',
      value: '89',
      description: '전시 대기 중인 상품',
      icon: Search,
      color: 'bg-yellow-500'
    },
    {
      title: '지점 수',
      value: '12',
      description: '관리 중인 지점',
      icon: Users,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">상품 전시 관리</h1>
              </div>
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                {userRole === 'admin' ? '관리자' : '지점 담당자'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={userRole} 
                onChange={(e) => setUserRole(e.target.value as 'admin' | 'branch')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="admin">관리자</option>
                <option value="branch">지점 담당자</option>
              </select>
              {userRole === 'branch' && (
                <select 
                  value={currentStore} 
                  onChange={(e) => setCurrentStore(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="store-001">강남점</option>
                  <option value="store-002">홍대점</option>
                  <option value="store-003">명동점</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="slot-map">슬롯 맵</TabsTrigger>
            <TabsTrigger value="product-registration">상품 등록</TabsTrigger>
            <TabsTrigger value="product-search">상품 검색</TabsTrigger>
            <TabsTrigger value="display-registration">전시 등록</TabsTrigger>
            <TabsTrigger value="user-management">사용자 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>최근 상품 등록 및 전시 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: '상품 등록', product: '코카콜라 500ml', store: '강남점', time: '5분 전' },
                    { action: '전시 완료', product: '펩시콜라 500ml', store: '홍대점', time: '15분 전' },
                    { action: '슬롯 변경', product: '스프라이트 500ml', store: '명동점', time: '1시간 전' },
                    { action: '재고 보충', product: '환타 500ml', store: '강남점', time: '2시간 전' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.product} - {activity.store}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slot-map">
            <SlotMapView userRole={userRole} currentStore={currentStore} />
          </TabsContent>

          <TabsContent value="product-registration">
            <ProductRegistration userRole={userRole} currentStore={currentStore} />
          </TabsContent>

          <TabsContent value="product-search">
            <ProductSearch userRole={userRole} currentStore={currentStore} />
          </TabsContent>

          <TabsContent value="display-registration">
            <DisplayRegistration userRole={userRole} currentStore={currentStore} />
          </TabsContent>

          <TabsContent value="user-management">
            <UserManagement userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
