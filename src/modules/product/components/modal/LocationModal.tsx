import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/dialog';
import { Badge } from '@/shared/ui/shadcn/badge';
import type { LocationModalProps } from '../../lib/types';

export const LocationModal = ({
  isLocationModalOpen,
  setIsLocationModalOpen,
  selectedProduct,
  getProductLocations
}: LocationModalProps) => {
  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 위치 정보</DialogTitle>
          <DialogDescription>
            {selectedProduct?.name}이(가) 할당된 위치들입니다.
          </DialogDescription>
        </DialogHeader>
        {selectedProduct && (
          <div className="space-y-4">
            <div className="space-y-2">
              {getProductLocations(selectedProduct.id).map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <p className="font-medium">{location.parentId}</p>
                    <p className="text-sm text-gray-500">{location.layer} 층</p>
                  </div>
                  <Badge variant="outline">
                    {location.currentQuantity}/{location.maxQuantity}
                  </Badge>
                </div>
              ))}
              {getProductLocations(selectedProduct.id).length === 0 && (
                <p className="py-4 text-center text-gray-500">
                  이 상품이 할당된 위치가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
