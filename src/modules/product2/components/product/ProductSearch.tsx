'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { getMockProducts } from '@/modules/product2/api/mock-data';
import { getMockLocations } from '@/modules/slot/api/mock-data';
import { Product } from '@/modules/product2/lib/types';
import { Slot } from '@/modules/slot/lib/types';
import { ProductSearchProps } from '../../lib/types';
import { List, Filter, Total } from '..';
import { CATEGORIES } from '../../lib';
import { EditProductModal } from '../modal/EditModal';
import LocationModal from '../modal/LocationModal';

export function ProductSearch({ userRole, currentStore }: ProductSearchProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>(getMockProducts());
  const [locations, setLocations] = useState<Slot[]>(getMockLocations());

  // 검색 및 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || product.status === statusFilter;

    const matchesPrice =
      (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
      (!priceRange.max || product.price <= parseInt(priceRange.max));

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  // 상품이 할당된 위치 찾기
  const getProductLocations = (productId: string) => {
    return locations.filter((location) => location.product?.id === productId);
  };

  // 상품 편집
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // 상품 삭제
  const handleDeleteProduct = (productId: string) => {
    // 실제로는 API 호출
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast({
      title: '상품 삭제 완료',
      description: '상품이 성공적으로 삭제되었습니다.'
    });
  };

  // 상품 저장
  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      toast({
        title: '상품 수정 완료',
        description: '상품 정보가 성공적으로 수정되었습니다.'
      });
      setEditingProduct(null);
      setIsEditModalOpen(false);
    }
  };

  // 위치 정보 보기
  const handleViewLocations = (product: Product) => {
    setSelectedProduct(product);
    setIsLocationModalOpen(true);
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setSortOrder('asc');
  };

  // 통계 정보
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.status === 'displayed'
  ).length;
  const lowStockProducts = products.filter((p) => p.quantity < 10).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Filter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={(sortOrder: string) =>
          setSortOrder(sortOrder as 'asc' | 'desc')
        }
        categories={CATEGORIES}
      />

      {/* 통계 카드 */}
      <Total
        totalProducts={totalProducts}
        activeProducts={activeProducts}
        lowStockProducts={lowStockProducts}
        totalValue={totalValue}
      />

      {/* 상품 목록 테이블 */}
      <List
        sortedProducts={filteredProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onViewLocations={handleViewLocations}
      />

      {/* 상품 편집 모달 */}
      <EditProductModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        onSaveProduct={handleSaveProduct}
      />

      {/* 위치 정보 모달 */}
      <LocationModal
        isLocationModalOpen={isLocationModalOpen}
        setIsLocationModalOpen={setIsLocationModalOpen}
        selectedProduct={selectedProduct}
        getProductLocations={getProductLocations}
      />
    </div>
  );
}
