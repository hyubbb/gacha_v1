import {
  Button,
  Label,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Select } from '@/shared/ui/shadcn/select';
import { EditProductModalProps } from '../../lib/types';
import { CATEGORIES } from '../../lib';

export const EditProductModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editingProduct,
  setEditingProduct,
  onSaveProduct
}: EditProductModalProps) => {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>상품 정보 수정</DialogTitle>
          <DialogDescription>상품 정보를 수정하세요</DialogDescription>
        </DialogHeader>
        {editingProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>상품명</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <Label>브랜드</Label>
                <Input
                  value={editingProduct.brand || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      brand: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <Label>가격</Label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
              <div>
                <Label>수량</Label>
                <Input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      quantity: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
              <div>
                <Label>카테고리</Label>
                <Select
                  value={editingProduct.category || ''}
                  onValueChange={(value) =>
                    setEditingProduct({ ...editingProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>상태</Label>
                <Select
                  value={editingProduct.status || 'registered'}
                  onValueChange={(value) =>
                    setEditingProduct({
                      ...editingProduct,
                      status: value as 'registered' | 'in_stock' | 'displayed'
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered">등록됨</SelectItem>
                    <SelectItem value="in_stock">재고 있음</SelectItem>
                    <SelectItem value="displayed">전시 중</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>설명</Label>
              <Input
                value={editingProduct.description || ''}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })
                }
                placeholder="상품 설명"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSaveProduct} className="flex-1">
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
  );
};
