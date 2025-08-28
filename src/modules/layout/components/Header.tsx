'use client';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { LogOut, Search, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import ChangePasswordModal from './modal/ChangePasswordModal';
import MypageModal from './modal/MypageModal';
import LogoutConfirmModal from './modal/LogoutConfirmModal';
import { cn } from '@/shared';

export const Header = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'branch'>('admin');
  const [currentStore, setCurrentStore] = useState('store-001');
  const [currentPage, setCurrentPage] = useState<'display' | 'stock'>(
    'display'
  );

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] =
    useState(false);
  const [isOpenLogoutConfirmModal, setIsOpenLogoutConfirmModal] =
    useState(false);

  const handleLogout = () => {
    setIsOpenLogoutConfirmModal(true);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenChangePasswordModal = () => {
    setIsOpenChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsOpenChangePasswordModal(false);
  };

  const handleCloseLogoutConfirmModal = () => {
    setIsOpenLogoutConfirmModal(false);
  };

  const handlePageChange = (page: 'display' | 'stock') => {
    setCurrentPage(page);
    router.push(`/${page}`);
  };

  return (
    <header className={cn('border-b border-gray-200 bg-white', className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 네비게이션 탭 */}
          <div className="flex items-center space-x-8">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => handlePageChange('display')}
                className={cn(
                  'w-28 rounded-md px-2 py-1 text-sm font-medium text-gray-900',
                  currentPage === 'display' && 'bg-white shadow-sm'
                )}
              >
                판매
              </button>
              <button
                onClick={() => handlePageChange('stock')}
                className={cn(
                  'w-28 rounded-md px-2 py-1 text-sm font-medium text-gray-900',
                  currentPage === 'stock' && 'bg-white shadow-sm'
                )}
              >
                재고
              </button>
            </div>
          </div>

          {/* 검색 및 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 검색 버튼 */}
            <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
              <Search className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                onClick={handleOpenModal}
              >
                <User className="h-5 w-5" />
              </button>

              {/* 마이페이지 드롭다운 - 숨김 상태 (클릭시 표시) */}
            </div>
          </div>
        </div>
      </div>

      {/* 마이페이지 모달 */}
      <MypageModal
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        handleOpenChangePasswordModal={handleOpenChangePasswordModal}
        handleLogout={handleLogout}
      />
      {/* 비밀번호 변경 모달 */}
      <ChangePasswordModal
        isOpenChangePasswordModal={isOpenChangePasswordModal}
        handleCloseChangePasswordModal={handleCloseChangePasswordModal}
      />
      {/* 로그아웃 확인 모달 */}
      <LogoutConfirmModal
        isOpenLogoutConfirmModal={isOpenLogoutConfirmModal}
        handleCloseLogoutConfirmModal={handleCloseLogoutConfirmModal}
        handleLogout={handleLogout}
      />
    </header>
  );
};
