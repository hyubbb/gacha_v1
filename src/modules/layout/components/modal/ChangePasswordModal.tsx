import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import React from 'react';

const ChangePasswordModal = ({
  isOpenChangePasswordModal,
  handleCloseChangePasswordModal
}: {
  isOpenChangePasswordModal: boolean;
  handleCloseChangePasswordModal: () => void;
}) => {
  return (
    <Dialog
      open={isOpenChangePasswordModal}
      onOpenChange={handleCloseChangePasswordModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogDescription>
            새로 변경할 비밀번호를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        {/* 이전과 동일한 암호일때 오류 발생 */}
        <div className="space-y-3 p-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">새 비밀번호</span>
            <Input type="password" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">비밀번호 확인</span>
            <Input type="password" />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCloseChangePasswordModal}>변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
