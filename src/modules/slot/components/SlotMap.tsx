import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Plus, Package, AlertCircle } from 'lucide-react';
import { Slot, ParentLocation } from '@/shared/lib';
import {
  LAYER_NAMES,
  LAYER_KOREAN,
  LAYER_NUMBERS,
  MAX_QUANTITY
} from '../lib/constants';
import { getLayerColor, hasPriceMismatch } from '../lib/utils/utils';
import { cn } from '@/shared/lib/utils';

// Legend component
export const MapLegend = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-green-300 bg-green-100"></div>
      <span>정상</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-orange-300 bg-orange-100"></div>
      <span>재고 부족</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-red-300 bg-red-100"></div>
      <span>품절</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100"></div>
      <span>장기 재고 (7일 이상)</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
      <span>빈 위치 (활성)</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-gray-400 bg-gray-200"></div>
      <span>비활성</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-purple-300 bg-purple-100"></div>
      <span>점검중</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border border-gray-300 bg-gray-100"></div>
      <span>미설정</span>
    </div>
    <div className="flex items-center space-x-1">
      <div className="h-4 w-4 rounded border-2 border-red-500"></div>
      <span>가격 불일치</span>
    </div>
  </div>
);

// Map controls component
export const MapControls = ({
  mapSize,
  setMapSize
}: {
  mapSize: { rows: number; cols: number };
  setMapSize: (size: { rows: number; cols: number }) => void;
}) => (
  <div className="mb-4 flex items-center space-x-2">
    <Label>맵 크기:</Label>
    <Input
      type="number"
      value={mapSize.cols}
      onChange={(e) =>
        setMapSize({ ...mapSize, cols: parseInt(e.target.value) || 15 })
      }
      className="w-20"
      min={5}
      max={50}
      placeholder="가로 (열)"
    />
    <span>×</span>
    <Input
      type="number"
      value={mapSize.rows}
      onChange={(e) =>
        setMapSize({ ...mapSize, rows: parseInt(e.target.value) || 10 })
      }
      className="w-20"
      min={5}
      max={50}
      placeholder="세로 (행)"
    />
  </div>
);

// Map cell component
export const MapCell = ({
  row,
  col,
  cellLocations,
  parentLocation,
  isSelected,
  onClick,
  className
}: {
  row: number;
  col: number;
  cellLocations: Slot[];
  parentLocation: ParentLocation | undefined;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      `h-16 w-16 cursor-pointer rounded-md border-1 shadow-sm transition-all hover:scale-105 ${isSelected ? 'ring-2 ring-blue-500' : ''} relative flex flex-col items-center justify-around p-1`,
      className
    )}
    onClick={onClick}
    title={
      parentLocation
        ? `${parentLocation.name || ''} (${row}, ${col})`
        : `위치: (${row}, ${col})`
    }
  >
    {/* 부모 위치 표시 뱃지 */}
    {parentLocation && (
      <div className="absolute top-0 -left-1 rounded bg-blue-600 px-1 text-xs text-[10px] text-white">
        {row},{col}
      </div>
    )}

    {LAYER_NAMES.map((layerName) => {
      const location = cellLocations.find((s) => s.layer === layerName);
      return (
        <div
          key={layerName}
          className={`flex h-1/3 w-full items-center justify-center rounded-sm text-xs ${getLayerColor(location)} ${hasPriceMismatch(location) ? 'border-2 border-red-500' : ''} `}
          title={
            location
              ? `(${row},${col}) ${LAYER_KOREAN[layerName]}: ${location.product?.name || '빈 위치'} (${location.currentQuantity}/${location.maxQuantity}) - ${location.price}원`
              : `미설정 (${layerName})`
          }
        >
          {location?.product ? (
            <Package className="h-3 w-3 text-gray-600" />
          ) : location ? (
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          ) : null}
        </div>
      );
    })}
  </div>
);

// Location info component
export const LocationInfo = ({ location }: { location: Slot }) => (
  <div className="space-y-2">
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div>
        <Label>좌표</Label>
        <p className="font-medium">
          {location.row}, {location.col}
        </p>
      </div>
      <div>
        <Label>위치 가격</Label>
        <p className="font-medium">{location.price}원</p>
      </div>
      <div>
        <Label>상태</Label>
        <Badge
          variant={location.status === 'active' ? 'default' : 'secondary'}
          className="ml-1"
        >
          {location.status === 'active'
            ? '활성'
            : location.status === 'inactive'
              ? '비활성'
              : '점검중'}
        </Badge>
      </div>
    </div>

    {location.product ? (
      <>
        <div className="mt-2 flex items-center space-x-3">
          <img
            src={location.product.image || '/placeholder.svg'}
            alt={location.product.name}
            className="h-12 w-12 rounded object-cover"
          />
          <div>
            <h5 className="font-medium">{location.product.name}</h5>
            <p className="text-sm text-gray-500">
              상품 ID: {location.product.id}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <Label>상품 가격</Label>
            <p className="font-medium">{location.product.price}원</p>
          </div>
          <div>
            <Label>재고 현황</Label>
            <p className="font-medium">
              {location.currentQuantity} / {location.maxQuantity}
            </p>
          </div>
          {location.product?.inStockDate && (
            <div>
              <Label>입고일</Label>
              <p className="font-medium">
                {location.product.inStockDate.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        {hasPriceMismatch(location) && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            <span>
              위치 가격({location.price}원)과 상품 가격({location.product.price}
              원)이 다릅니다!
            </span>
          </div>
        )}
      </>
    ) : (
      <p className="text-gray-500">등록된 상품이 없습니다.</p>
    )}
  </div>
);
