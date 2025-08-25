import { useState } from 'react';
import { getMockLocations, getMockParentLocations } from '../api/mock-data';
import type { ParentLocation, Slot } from '@/shared/lib';

export const useSlotMapData = () => {
  const [parentLocations, setParentLocations] = useState<ParentLocation[]>(
    getMockParentLocations()
  );
  const [locations, setLocations] = useState<Slot[]>(getMockLocations());

  const refreshData = () => {
    setParentLocations(getMockParentLocations());
    setLocations(getMockLocations());
  };

  return { parentLocations, locations, refreshData };
};
