import React from 'react';

export const Subtitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="ml-2 flex items-center gap-2 text-sm text-gray-500">
      {children}
    </div>
  );
};
