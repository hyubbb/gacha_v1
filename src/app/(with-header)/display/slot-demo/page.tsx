'use client';

import { SlotMapView2 } from '@/widgets/slot/ui/SlotMapView2';

export default function SlotDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">슬롯 맵 데모</h1>
      <p className="mb-4 text-gray-600">
        사용자 역할에 따라 슬롯이 다르게 표시됩니다:
      </p>
      <ul className="mb-6 list-disc pl-6 text-gray-600">
        <li>
          <strong>관리자:</strong> 모든 슬롯이 표시됩니다
        </li>
        <li>
          <strong>지점 담당자:</strong> 부모 위치 정보가 있는 슬롯만 표시되고,
          나머지는 invisible 처리됩니다
        </li>
      </ul>

      <SlotMapView2 userRole="admin" currentStore="store-001" />
    </div>
  );
}
