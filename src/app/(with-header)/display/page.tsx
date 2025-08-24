'use client';
import { SlotMapView } from '@/widgets/slot';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const page = () => {
  const userRole = 'admin';
  const currentStore = '001';
  return <SlotMapView userRole={userRole} currentStore={currentStore} />;
};

export default page;
