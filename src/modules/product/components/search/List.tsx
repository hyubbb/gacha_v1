import { Card, TableCell, TableRow, TableBody,TableHead, TableHeader, CardContent, CardHeader, CardTitle, Table, Button, Badge } from '@/shared'
import { Edit, Trash2, MapPin } from 'lucide-react'
import React from 'react'
import type { ListProps } from '@/modules/product/lib/types'



export const List = ({ sortedProducts, onEditProduct, onDeleteProduct, onViewLocations }: ListProps) => {
  return (
    <Card>
        <CardHeader>
          <CardTitle>검색 결과 ({sortedProducts.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품 정보</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>입고일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.brand && (
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category || '미분류'}</Badge>
                  </TableCell>
                  <TableCell>{product.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <span className={product.quantity < 10 ? 'text-red-600 font-medium' : ''}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === 'displayed' ? 'default' :
                      product.status === 'in_stock' ? 'secondary' : 'outline'
                    }>
                      {product.status === 'displayed' ? '전시 중' :
                       product.status === 'in_stock' ? '재고 있음' : '등록됨'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.inStockDate ? new Date(product.inStockDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewLocations(product)}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  )
}
