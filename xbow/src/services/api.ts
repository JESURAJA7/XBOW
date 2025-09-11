import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';


const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('xbow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('xbow_token');
      Cookies.remove('xbow_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: any) => api.post(`${API_BASE_URL}/auth/register`, userData),
  login: (credentials: any) => api.post(`${API_BASE_URL}/auth/login`, credentials),
  getProfile: () => api.get('/auth/me'),
};

export const loadAPI = {
 createLoad: (data: FormData, config?: any) => 
    api.post(`${API_BASE_URL}/loads`, data, config),
  getMyLoads: () => api.get(`${API_BASE_URL}/loads`),
  getAvailableLoads: (params?: any) => api.get('/loads/available', { params }),
  getLoad: (id: string) => api.get(`/loads/${id}`),
  uploadMaterialPhotos: (loadId: string, materialIndex: number, formData: FormData) =>
  api.post(
    `${API_BASE_URL}/loads/materials/${materialIndex}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ),
  updateLoadStatus: (loadId: string, status: string) =>
    api.put(`/loads/${loadId}/status`, { status }),
  deleteLoad: (loadId: string) => api.delete(`/loads/${loadId}`),
   // Apply for a load with selected vehicle
  applyForLoad: (loadId: string, vehicleId: string, message?: string) =>
    api.post('/load-applications', { loadId, vehicleId, message }),

  // Get applications for a specific load (for load providers)
  getLoadApplications: (loadId: string) =>
    api.get(`${API_BASE_URL}/vehicles/load/${loadId}/applications`),

  // Get my applications (for vehicle owners)
  getMyApplications: () =>
    api.get('/load-applications/my-applications'),

  // Accept/reject an application (for load providers)
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected', message?: string) =>
    api.put(`/load-applications/${applicationId}`, { status, message }),


  // Send message to load provider
  sendMessage: (loadId: string, message: string) =>
    api.post(`${API_BASE_URL}/vehicles/${loadId}/messages`, { message }),

  // Get messages for a load
  getLoadMessages: (loadId: string) =>
    api.get(`/loads/${loadId}/messages`),

  // Get load status history
  getLoadStatusHistory: (loadId: string) =>
    api.get(`/loads/${loadId}/status-history`)
};

export const vehicleAPI = {
 createVehicle: (data: any, config = {}) =>
    api.post(`${API_BASE_URL}/vehicles`, data, config),

  getMyVehicles: () => api.get(`${API_BASE_URL}/vehicles`),
  getAvailableVehicles: (params?: any) => api.get(`${API_BASE_URL}/vehicles/available`, { params }),
  getVehicle: (id: string) => api.get(`${API_BASE_URL}/vehicles/${id}`),
  uploadVehiclePhotos: (vehicleId: string, photos: any[]) =>
    api.post(`/vehicles/${vehicleId}/photos`, { photos }),
  updateVehicleStatus: (vehicleId: string, status: string) =>
    api.put(`${API_BASE_URL}/vehicles/${vehicleId}/status`, { status }),
};

export const paymentAPI = {
  createOrder: (orderData: any) => api.post('/payments/create-order', orderData),
  verifyPayment: (paymentData: any) => api.post('/payments/verify', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

export const podAPI = {
  uploadPOD: (podData: any) => api.post('/pods', podData),
  getMyPODs: () => api.get('/pods/my-pods'),
  getPODsByLoad: (loadId: string) => api.get(`/pods/load/${loadId}`),
};


export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData: any) => api.put('/profile', profileData),
  uploadDocuments: (documents: any[]) => api.post('/profile/documents', { documents }),
  getCompletionStatus: () => api.get('/profile/completion-status'),
};

export const subscriptionAPI = {
  getSubscriptionDetails: () => api.get('/subscription'),
  createSubscriptionOrder: () => api.post('/subscription/create-order'),
  verifySubscriptionPayment: (paymentData: any) => api.post('/subscription/verify', paymentData),
};

export const vehicleMatchingAPI = {
  // Get matching vehicles for a load
  getMatchingVehicles: (loadId: string) =>
    api.get(`${API_BASE_URL}/vehicles/vehicle-matching/load/${loadId}/vehicles`),

  // Apply for a load with a vehicle
  applyForLoad: (loadId: string, vehicleId: string, bidPrice?: number, message?: string) =>
    api.post(`${API_BASE_URL}/vehicles/apply`, {
      loadId,
      vehicleId,
      bidPrice,
      message
    }),

  // Get applications for a load (for load providers)
  getLoadApplications: (loadId: string) =>
    api.get(`${API_BASE_URL}/vehicles/load/${loadId}/applications`),

  // Accept/reject vehicle application
  respondToApplication: (applicationId: string, status: 'accepted' | 'rejected', agreedPrice?: number) =>
    api.patch(`${API_BASE_URL}/vehicles/application/${applicationId}/respond`, {
      status,
      agreedPrice
    }),

  // Get my vehicle applications (for vehicle owners)
  getMyApplications: () =>
    api.get(`${API_BASE_URL}/vehicles/vehicle-matching/my-applications`),

  // Update load assignment status
  updateAssignmentStatus: (assignmentId: string, status: string) =>
    api.patch(`${API_BASE_URL}/vehicles/vehicle-matching/assignment/${assignmentId}/status`, { status }),

  // Send message between load provider and vehicle owner
  sendMessage: (loadId: string, vehicleId: string, message: string) =>
    api.post(`${API_BASE_URL}/vehicles/vehicle-matching/message`, {
      loadId,
      vehicleId,
      message
    }),

  // Get messages for a load/vehicle combination
  getMessages: (loadId: string, vehicleId?: string) =>
    api.get(`${API_BASE_URL}/vehicles/vehicle-matching/messages/${loadId}${vehicleId ? `/${vehicleId}` : ''}`),

  // Submit rating and review
  submitRating: (loadId: string, vehicleId: string, rating: number, comment?: string) =>
    api.post(`${API_BASE_URL}/vehicles/v0/rating`, {
      loadId,
      vehicleId,
      rating,
      comment
    }),

  // Get ratings for a user
  getUserRatings: (userId: string) =>
    api.get(`${API_BASE_URL}/vehicles/vehicle-matching/ratings/${userId}`),

  // Select vehicle for load (for load providers)
  selectVehicle: (loadId: string, vehicleId: string, agreedPrice: number) =>
    api.post(`${API_BASE_URL}/vehicles/vehicle-matching/select-vehicle`, {
      loadId,
      vehicleId,
      agreedPrice
    }),

     getMatchingVehiclesForLoad: (loadId: string) =>
    api.get(`${API_BASE_URL}/vehicles/vehicle-matching/load/${loadId}/matching-vehicles`),

  // Send vehicle request to vehicle owner
  sendVehicleRequest: (loadId: string, vehicleId: string, message?: string) =>
    api.post(`${API_BASE_URL}/vehicles/send-vehicle-request`, {
      loadId,
      vehicleId,
      message
    }),

  // Get vehicle requests for vehicle owner
  getVehicleRequests: () =>
    api.get(`${API_BASE_URL}/vehicles/v0/my-vehicle-requests`),

  // Respond to vehicle request
  respondToVehicleRequest: (requestId: string, status: 'accepted' | 'rejected') =>
    api.patch(`${API_BASE_URL}/vehicles/vehicle-request/${requestId}/respond`, { status }),

   updateLoadStatus: (loadId: string, status: string) =>
    api.patch(`${API_BASE_URL}/vehicles/load/v0/${loadId}/status`, { status })


};

export const vehicleRequestAPI = {
  // Get vehicle requests for vehicle owner
  getVehicleRequests: () => {
    return api.get('/vehicles/requests');
  },

  // Respond to vehicle request
  respondToVehicleRequest: (requestId: string, status: 'accepted' | 'rejected') => {
    return api.put(`/vehicles/requests/${requestId}/respond`, { status });
  },

  // Get my assignments (for vehicle owners)
  getMyAssignments: () => {
    return api.get('/vehicles/assignments');
  },

  // Update assignment status
  updateAssignmentStatus: (assignmentId: string, status: string) => {
    return api.put(`/vehicles/assignments/${assignmentId}/status`, { status });
  },

  // Send message in assignment
  sendAssignmentMessage: (assignmentId: string, message: string) => {
    return api.post(`/vehicles/assignments/${assignmentId}/message`, { message });
  }
};
export default api;