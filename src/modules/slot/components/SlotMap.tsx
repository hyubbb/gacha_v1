import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';
import { Badge } from '@/shared/ui/shadcn/badge';
import { Plus, Package, AlertCircle } from 'lucide-react';
import {
  LAYER_NAMES,
  LAYER_KOREAN,
  LAYER_NUMBERS,
  MAX_QUANTITY
} from '../lib/constants';
import {
  getLayerColor,
  hasPriceMismatch,
  hasAvailableSlots,
  getAvailableSlots
} from '../lib/utils/utils';
import { cn } from '@/shared/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared';
import { ParentLocation, Product, Slot } from '../lib';

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
  className,
  selectedStockProduct,
  role = 'branch',
  status
}: {
  row: number;
  col: number;
  cellLocations: Slot[];
  parentLocation: ParentLocation | undefined;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  selectedStockProduct?: Product | null;
  role?: 'admin' | 'branch';
  status?: 'view' | 'add' | 'old' | 'empty' | null;
}) => (
  <div
    className={cn(
      `h-16 w-16 cursor-pointer gap-px rounded-md border-1 shadow-sm transition-all hover:scale-105 ${isSelected ? 'ring-2 ring-blue-500' : ''} relative flex flex-col items-center justify-around p-1`,
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

    {LAYER_NAMES.map((layerName, index) => {
      const location = cellLocations.find((s) => s.layer === layerName);

      // // 빈자리 필터링 로직
      // const isEmptySlot = location && !location.product;
      // const isPriceMatch = selectedStockProduct
      //   ? location?.price === selectedStockProduct.price
      //   : false;

      // // 재고 선택중이고, 슬롯설정되어있고, 빈자리이고, 가격이 일치하면 보이도록 처리
      // const shouldShowLayer = selectedStockProduct
      //   ? isEmptySlot && isPriceMatch
      //   : location; // selectedStockProduct가 없으면 기존 로직 적용

      const isAdmin = role === 'admin';

      // view 상태일때는 location 이 없는값말곤 다 보여줘야함
      // const isDisplay = status === 'view';
      // const shouldShow = isDisplay ? true : shouldShowLayer;

      // 전체 조건정리
      // status가 add 이면 빈슬롯만 보여줘야함, 단, admin일경우는 상관없음
      // role이 admin이면 모든 슬롯을 보여줘야함.
      // status가 add이고 role이 branch이면 부모 위치가 있는 가격이 일치하는 슬롯만 보여줘야함.
      // 오래된 슬롯만 보여주는 경우도있음. 이경우는 add이면서 branch이면서 status가 old일경우
      // 빈슬롯만 보여주는 경우도있음. 이경우는 add이면서 branch이면서 status가 empty일경우 금액상관없이 현재 비어있는 곳 보여줌

      // 조건 로직 구현
      const isEmptySlot = location && !location.product;
      const isPriceMatch = selectedStockProduct
        ? location?.price === selectedStockProduct.price
        : false;

      // 오래된 슬롯 판별 (7일 이상된 상품)
      const isOldSlot = location?.product?.inStockDate
        ? new Date().getTime() -
            new Date(location.product.inStockDate).getTime() >
          7 * 24 * 60 * 60 * 1000
        : false;

      let shouldShowLayer = null;

      // Admin인 경우 모든 슬롯 표시
      if (isAdmin) {
        shouldShowLayer = location;
      }
      // View 모드인 경우 모든 슬롯 표시
      else if (status === 'view') {
        shouldShowLayer = location;
      }
      // Add 모드인 경우
      else if (status === 'add') {
        // 기본 add 모드
        if (parentLocation) {
          // 부모 위치가 있는 경우 가격 일치하는 슬롯만 표시
          shouldShowLayer = isEmptySlot && isPriceMatch ? location : null;
        } else {
          // 부모 위치가 없는 경우 빈 슬롯만 표시
          shouldShowLayer = isEmptySlot ? location : null;
        }
      }
      // Old 상태인 경우 (오래된 슬롯 + 빈 슬롯)
      else if (status === 'old') {
        shouldShowLayer = isOldSlot ? location : null;
      }
      // Empty 상태인 경우 (빈 슬롯만)
      else if (status === 'empty') {
        shouldShowLayer = isEmptySlot ? location : null;
      }
      // 기본적으로 location 표시
      else {
        shouldShowLayer = location;
      }

      // shouldShow는 shouldShowLayer가 존재하는지 여부로 결정
      const shouldShow =
        shouldShowLayer !== null && shouldShowLayer !== undefined;

      return (
        <div
          key={layerName}
          className={cn(
            `flex h-1/3 w-full items-center justify-center text-xs ${getLayerColor(location)}`,
            index === 0 && 'rounded-t-sm',
            index === 2 && 'rounded-b-sm',
            // hasPriceMismatch(location) && 'border-2 border-red-500',
            !shouldShow && !isAdmin && 'invisible'
          )}
          title={
            location
              ? `(${row},${col}) ${LAYER_KOREAN[layerName]}: ${location.product?.name || '빈 위치'} (${location.currentQuantity}/${location.maxQuantity}) - ${location.price}원`
              : `미설정 (${layerName})`
          }
        >
          {shouldShowLayer &&
            (location?.product ? (
              // <Package className="h-3 w-3 text-gray-600" />
              <></>
            ) : location ? (
              // status가 조건에 맞는 곳을 보여줄 때만 row-col 표시
              shouldShow && status ? (
                <div className="text-dark-20 text-xs">
                  {row}-{col}
                </div>
              ) : null
            ) : null)}
        </div>
      );
    })}
  </div>
);

// 빈 슬롯 상태 확인 컴포넌트
export const SlotAvailabilityStatus = ({
  allSlots,
  targetPrice
}: {
  allSlots: Slot[];
  targetPrice?: number;
}) => {
  const hasSlots = hasAvailableSlots(allSlots, targetPrice);
  const availableSlots = getAvailableSlots(allSlots, targetPrice);

  if (!hasSlots) {
    return (
      <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-600">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>
          {targetPrice
            ? `${targetPrice}원 가격대의 빈 슬롯이 없습니다.`
            : '할당할 수 있는 빈 슬롯이 없습니다.'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-md bg-green-50 p-3 text-sm text-green-600">
      <Package className="mr-2 h-4 w-4" />
      <span>
        {targetPrice
          ? `${targetPrice}원 가격대의 빈 슬롯 ${availableSlots.length}개 사용 가능`
          : `빈 슬롯 ${availableSlots.length}개 사용 가능`}
      </span>
    </div>
  );
};

// Location info component
export const LocationInfo = ({ location }: { location: Slot }) => (
  <div className="space-y-2">
    {location.product ? (
      <>
        <div className="flex gap-4 text-sm">
          <div className="mt-2 flex flex-col items-center">
            <img
              src={location.product.image || '/placeholder.svg'}
              alt={location.product.name}
              className="h-12 w-12 rounded object-cover"
            />
            <div>
              <h5 className="font-medium">{location.product.name}</h5>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <div className="flex gap-2">
              <Label>상품 가격</Label>
              <p className="font-medium">{location.product.price}원</p>
            </div>
            {location.product?.inStockDate && (
              <div className="flex gap-2">
                <Label>입고일</Label>
                <p className="font-medium">
                  {/* {location.product.inStockDate?.slice(0, 10)} */}
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    ) : (
      <p className="text-gray-500">등록된 상품이 없습니다.</p>
    )}
  </div>
);
