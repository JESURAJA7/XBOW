

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'admin' | 'load_provider' | 'vehicle_owner';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired';
  subscriptionEndDate?: string;
  trialDays?: number;
  createdAt: string;
  isApproved: boolean;
}

export interface LoadProvider extends User {
  role: 'load_provider';
  companyName: string;
  totalLoadsPosted: number;
  subscriptionFee: number;
}

export interface VehicleOwner extends User {
  role: 'vehicle_owner';
  totalVehicles: number;
  preferredOperatingState: string;
  preferredOperatingDistrict: string;
  subscriptionFeePerVehicle: number;
}

export interface Load {
  id: string;
  loadProviderId: string;
  loadProviderName: string;
  loadingLocation: {
    pincode: string;
    state: string;
    district: string;
    place: string;
  };
  unloadingLocation: {
    pincode: string;
    state: string;
    district: string;
    place: string;
  };
  vehicleRequirement: {
    size: number;
    type: string;
    trailer?: string;
  };
  materials: Material[];
  loadingTime: string;
  paymentTerms: string;
  isXBOWResponsible: boolean;
  status: 'posted' | 'assigned' | 'enroute' | 'delivered' | 'completed';
  assignedVehicleId?: string;
  createdAt: string;
  commissionApplicable: boolean;
  commissionAmount?: number;
}

export interface Material {
  id: string;
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  packType: 'single' | 'multi';
  totalCount: number;
  singleWeight: number;
  totalWeight: number;
  photos: MaterialPhoto[];
}

export interface MaterialPhoto {
  id: string;
  type: 'front' | 'side' | 'top' | 'packing' | 'optional';
  url: string;
  uploadedAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  vehicleType: string;
  vehicleNumber: string;
  passingLimit: number;
  availability: string;
  isOpen: boolean;
  tarpaulin: 'one' | 'two' | 'none';
  preferredOperatingArea: {
    state: string;
    district: string;
    place: string;
  };
  photos: VehiclePhoto[];
  status: 'available' | 'assigned' | 'in_transit';
  createdAt: string;
  isApproved: boolean;
}

export interface VehiclePhoto {
  id: string;
  type: 'front' | 'side' | 'back' | 'rc_permit' | 'optional';
  url: string;
  uploadedAt: string;
}

export interface POD {
  id: string;
  loadId: string;
  uploadedBy: string;
  type: 'photo' | 'pdf';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'subscription' | 'commission';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLoads: number;
  totalVehicles: number;
  activeSubscriptions: {
    loadProviders: number;
    vehicleOwners: number;
  };
  paymentsReceived: {
    today: number;
    thisMonth: number;
    total: number;
  };
  pendingApprovals: {
    users: number;
    vehicles: number;
    pods: number;
  };
  commission: {
    thisMonth: number;
    total: number;
  };
}

