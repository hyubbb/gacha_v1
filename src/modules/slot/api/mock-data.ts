import {
  initialMockLocations,
  initialMockParentLocations
} from '@/shared/hooks/dummyData';
import { ParentLocation, Slot } from '../lib/types';

let currentMockLocations: Slot[] = [...initialMockLocations];
let currentMockParentLocations: ParentLocation[] = [
  ...initialMockParentLocations
];

export const getMockLocations = () => [...currentMockLocations];
export const getMockParentLocations = () => [...currentMockParentLocations];

export const updateMockLocation = (updatedLocation: Slot) => {
  currentMockLocations = currentMockLocations.map((s) =>
    s.id === updatedLocation.id ? updatedLocation : s
  );
};

export const updateMockParentLocation = (
  updatedParentLocation: ParentLocation
) => {
  currentMockParentLocations = currentMockParentLocations.map((ps) =>
    ps.id === updatedParentLocation.id ? updatedParentLocation : ps
  );
};

export const addMockParentLocation = (newParentLocation: ParentLocation) => {
  currentMockParentLocations.push(newParentLocation);
};

export const deleteMockParentLocation = (parentLocationId: string) => {
  currentMockParentLocations = currentMockParentLocations.filter(
    (ps) => ps.id !== parentLocationId
  );
  currentMockLocations = currentMockLocations.filter(
    (s) => s.parentId !== parentLocationId
  ); // 자식 위치도 함께 삭제
};

export const addMockLocation = (newLocation: Slot) => {
  currentMockLocations.push(newLocation);
};

export const deleteMockLocation = (locationId: string) => {
  currentMockLocations = currentMockLocations.filter(
    (s) => s.id !== locationId
  );
};
