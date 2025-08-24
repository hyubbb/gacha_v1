import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import React from 'react';

const LogoutConfirmModal = ({
  isOpenLogoutConfirmModal,
  handleCloseLogoutConfirmModal,
  handleLogout
}: {
  isOpenLogoutConfirmModal: boolean;
  handleCloseLogoutConfirmModal: () => void;
  handleLogout: () => void;
}) => {
  return (
    <Dialog
      open={isOpenLogoutConfirmModal}
      onOpenChange={handleCloseLogoutConfirmModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseLogoutConfirmModal}>
            취소
          </Button>
          <Button variant="default" onClick={handleLogout}>
            로그아웃
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmModal;
