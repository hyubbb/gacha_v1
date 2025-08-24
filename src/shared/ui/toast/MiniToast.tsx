'use client';
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { miniToastAtom } from '@/shared/jotai/atom';
import { cn } from '@/shared/lib/utils';

export const MiniToast = () => {
  const [miniToast, setMiniToast] = useAtom(miniToastAtom);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (miniToast?.open) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setMiniToast({ ...miniToast, open: false });
        }, 300); // exit 애니메이션 완료 후 상태 변경
      }, miniToast.time);
    }
  }, [miniToast]);

  if (!miniToast?.open) return null;

  return (
    <section
      className={cn(
        `fixed right-0 left-0 z-50 m-auto flex h-14 w-[95%] items-center justify-start rounded-lg bg-black/40 px-6 text-white backdrop-blur-md transition-all duration-300 ease-in-out`,
        isVisible
          ? 'animate-in fade-in-0 slide-in-from-bottom-10'
          : 'animate-out fade-out-0 slide-out-to-bottom-10',
        miniToast.position === 'top'
          ? 'header-height-margin top-0 bottom-auto m-auto'
          : 'top-auto bottom-0 m-auto mb-16'
      )}
    >
      <p>{miniToast.message}</p>
      {miniToast.isButton && (
        <button onClick={miniToast.onClose}>{miniToast.buttonText}</button>
      )}
    </section>
  );
};
