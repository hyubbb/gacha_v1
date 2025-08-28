import { SlotMapView2 } from '@/widgets/slot/ui/SlotMapView2';
const page = () => {
  const userRole = 'admin';
  const currentStore = '001';

  return <SlotMapView2 userRole={userRole} currentStore={currentStore} />;
};

export default page;
