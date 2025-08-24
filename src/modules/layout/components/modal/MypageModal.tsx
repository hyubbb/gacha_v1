import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { LogOut } from 'lucide-react';
import React from 'react';

const MypageModal = ({
  isOpenModal,
  handleCloseModal,
  handleOpenChangePasswordModal,
  handleLogout
}: {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  handleOpenChangePasswordModal: () => void;
  handleLogout: () => void;
}) => {
  return (
    <Dialog open={isOpenModal} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>마이페이지</DialogTitle>
        </DialogHeader>

        {/* 본문 컨텐츠 (기존 코드 그대로) */}
        <div className="p-2">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">아이디</span>
              <span className="text-sm text-gray-900">Gacha@naver.com</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">비밀번호</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900">Gacha!@#$</span>
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={handleOpenChangePasswordModal}
                >
                  변경하기
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* Footer가 필요하면 아래처럼 추가 (없으면 생략 가능) */}
        {/* <DialogFooter>
        <button onClick={() => handleCloseModal(false)} className="text-sm text-gray-600 hover:text-gray-900">
          닫기
        </button>
      </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default MypageModal;
