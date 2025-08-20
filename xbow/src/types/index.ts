// Common interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: Coordinates;
  pincode: string;
  district: string;
  place: string;
}

export interface Dimensions {
  length: number | string;
  width: number | string;
  height: number | string;
}

// Photo interfaces
export interface MaterialPhoto {
  type: string; 
  file?: File | null;
  preview?: string | null;
  url?: string;
  id?: string;
  uploadedAt?: string;
}

export interface VehiclePhoto {
  type: string;
  url: string;
  id?: string;
  publicId?: string; 
  uploadedAt?: string;
}

// Material interface
export interface Material {
  id?: string;
  name: string;
  packType:string;
  totalCount: number;
  dimensions: Dimensions;
  singleWeight: number;
  totalWeight: number;
  photos: MaterialPhoto[];
}

// Vehicle Requirement interface
export interface VehicleRequirement {
  vehicleType: string;
  size: number;
  trailerType: string;
  type?: string; // For backward compatibility
  trailer?: string; // For backward compatibility
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'load_provider' | 'vehicle_owner' | 'admin';
  isApproved: boolean;
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired';
  subscriptionEndDate?: string;
  trialDays?: number;
  companyName?: string;
  totalLoadsPosted?: number;
  totalVehicles?: number;
  preferredOperatingState?: string;
  preferredOperatingDistrict?: string;
  createdAt: string;
}

// Load interface
export interface Load {
  id: string;
  loadProviderId: string;
  loadProviderName: string;
  title?: string; // Make optional if not always present
  description?: string; // Make optional if not always present
  loadingLocation: {
    pincode: string;
    state: string;
    district: string;
    place: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    // Add other location properties if needed
    address?: string;
    city?: string;
    zipCode?: string;
  };
  unloadingLocation: {
    pincode: string;
    state: string;
    district: string;
    place: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    // Add other location properties if needed
    address?: string;
    city?: string;
    zipCode?: string;
  };
  pickupDate?: string; // Make optional if not always present
  deliveryDate?: string; // Make optional if not always present
  weight?: string; // Make optional if not always present
  dimensions?: { // Make optional if not always present
    length: string;
    width: string;
    height: string;
  };
  specialRequirements?: string; // Make optional
  rate?: string; // Make optional
  vehicleRequirement: {
    vehicleType: string;
    size: number;
    trailerType: string;
  };
  materials?: Material[]; // Make optional
  loadingDate: string;
  loadingTime: string;
  paymentTerms: string;
  withXBowSupport?: boolean; // Make optional
  status: 'active' | 'inactive' | 'completed' | 'cancelled' | string; // Allow other strings
  assignedVehicleId?: string;
  commissionApplicable?: boolean; // Make optional
  commissionAmount?: number; // Make optional
  createdAt: string;
}

// Vehicle interface
export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  vehicleType: string;
  vehicleNumber: string;
  passingLimit: number;
  vehicleSize: number;
  vehicleWeight: number;
  availability: string;
  isOpen: boolean;
  tarpaulin: string;
  preferredOperatingArea: {
    state: string;
    district: string;
    place: string;
  };
  dimensions: {
    length: number;
    breadth: number;
  };
    trailerType: string;
  photos: VehiclePhoto[];
  status: string;
  rating?: number;
  totalTrips?: number; 
   bidPrice?: number; 
  publicId? : string; 
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
}

// POD (Proof of Delivery) interface
export interface POD {
  id: string;
  loadId: string;
  vehicleId: string;
  uploadedBy: string;
  type: 'photo' | 'pdf';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  uploadedAt: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalLoads: number;
  totalVehicles: number;
  activeLoads?: number;
  completedLoads?: number;
  pendingApprovals: {
    users: number;
    vehicles: number;
    pods: number;
  };
  monthlyRevenue?: number;
  activeSubscriptions?: {
    loadProviders: number;
    vehicleOwners: number;
  };
  paymentsReceived?: {
    today: number;
    thisMonth: number;
    total: number;
  };
  commission?: {
    thisMonth: number;
    total: number;
  };
}

// Form Data interface (for your PostLoadPage component)
export interface FormData {
  title: string;
  description: string;
  loadingLocation: Location;
  unloadingLocation: Location;
  pickupDate: string;
  deliveryDate: string;
  weight: string;
  dimensions: Dimensions;
  specialRequirements: string;
  rate: string;
  vehicleRequirement: VehicleRequirement;
  materials: Material[];
  loadingDate: string;
  loadingTime: string;
  paymentTerms: 'advance' | 'cod' | 'after_pod' | 'to_pay' | 'credit';
  withXBowSupport: boolean;
}