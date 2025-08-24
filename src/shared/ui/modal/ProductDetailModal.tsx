'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../shadcn/dialog';
import { productDetailModalAtom } from '@/shared/jotai/atom';
import { useAtom } from 'jotai';
import { ProductDetail } from '@/modules/product/components/product/ProductDetail';

export const ProductDetailModal = () => {
  const [productDetailModal, setProductDetailModal] = useAtom(
    productDetailModalAtom
  );

  const handleOpenChange = (open: boolean) => {
    setProductDetailModal({ ...productDetailModal, open });
  };

  return (
    <Dialog open={productDetailModal.open} onOpenChange={handleOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{''}</DialogTitle>
        </DialogHeader>
        <ProductDetail />
      </DialogContent>
    </Dialog>
  );
};
