export interface DisplayRegistrationProps {
    userRole: 'admin' | 'branch'
    currentStore: string
  }
  
  export interface DisplayAssignment {
    id: string
    productId: string
    productName: string
    locationId: string
    parentLocationName: string
    layer: string
    quantity: number
    startDate: Date
    endDate?: Date
    status: 'active' | 'scheduled' | 'ended'
    priority: 'high' | 'medium' | 'low'
  }