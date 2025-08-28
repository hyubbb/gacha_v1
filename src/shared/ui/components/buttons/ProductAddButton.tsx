import { Plus } from 'lucide-react';
import React, { useState } from 'react';

export const ProductAddButton = ({ onClick }: { onClick: () => void }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className="bg-black-60 fixed right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-lg"
      onClick={handleClick}
    >
      <Plus size={20} className="text-white" />
    </button>
  );
};
