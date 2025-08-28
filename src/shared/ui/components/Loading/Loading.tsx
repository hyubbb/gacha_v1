import React from 'react';

export const Loading = () => {
  return (
    <section className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" />
      </div>
    </section>
  );
};
