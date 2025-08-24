'use client';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../shadcn';
import { errorHistoryModalAtom } from '@/shared/jotai/atom';
import { useAtom } from 'jotai';
import { CircleAlert } from 'lucide-react';

export const ErrorHistoryModal = () => {
  const [errorHistoryModal, setErrorHistoryModal] = useAtom(
    errorHistoryModalAtom
  );

  const handleOpenChange = (open: boolean) => {
    setErrorHistoryModal({ ...errorHistoryModal, open });
  };

  const data = [
    {
      date: '2025-01-01',
      errorCode: 'E001',
      errorMessage: '에러 메시지'
    },
    {
      date: '2025-01-02',
      errorCode: 'E002',
      errorMessage: '에러 메시지2'
    }
  ];

  return (
    <Dialog open={errorHistoryModal.open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>오류 히스토리</DialogTitle>
        </DialogHeader>

        {data.length === 0 ? (
          <div className="flex flex-col items-center gap-2">
            <CircleAlert className="h-10 w-10 text-gray-500" />
            <span className="text-sm text-gray-500">
              오류 히스토리가 없습니다.
            </span>
            <span className="text-sm text-gray-500">
              슬롯에 문제가 생기면 여기에 나타납니다.
            </span>
          </div>
        ) : (
          data.map((item) => (
            <section key={item.date}>
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500">날짜</span>
                  <div>
                    <span className="text-md font-semibold text-gray-500">
                      에러 코드
                    </span>
                    <span className="text-sm text-gray-500">에러 메시지</span>
                  </div>
                </div>
                <div>
                  <Button variant={'outline'}>해결 완료</Button>
                </div>
              </div>
            </section>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};
