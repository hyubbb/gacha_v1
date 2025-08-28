import { useState } from 'react';
import type { ParentLocation, Slot } from '@/modules/slot/lib';
import type { MapSize, SelectedCell } from '../lib/types';

export const useSlotMapState = () => {
  const [mapSize, setMapSize] = useState<MapSize>({ rows: 10, cols: 15 });
  const [selectedLocationCell, setSelectedLocationCell] =
    useState<SelectedCell>(null);
  const [editingLocation, setEditingLocation] = useState<Slot | null>(null);
  const [editingParentLocation, setEditingParentLocation] =
    useState<ParentLocation | null>(null);
  const [isAssignProductModalOpen, setIsAssignProductModalOpen] =
    useState(false);
  const [currentLocationForAssignment, setCurrentLocationForAssignment] =
    useState<Slot | null>(null);

  return {
    mapSize,
    setMapSize,
    selectedLocationCell,
    setSelectedLocationCell,
    editingLocation,
    setEditingLocation,
    editingParentLocation,
    setEditingParentLocation,
    isAssignProductModalOpen,
    setIsAssignProductModalOpen,
    currentLocationForAssignment,
    setCurrentLocationForAssignment
  };
};
