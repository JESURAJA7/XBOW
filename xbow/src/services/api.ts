import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

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
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

export const loadAPI = {
  createLoad: (loadData: any) => api.post('/loads', loadData),
  getMyLoads: () => api.get('/loads'),
  getAvailableLoads: (params?: any) => api.get('/loads/available', { params }),
  getLoad: (id: string) => api.get(`/loads/${id}`),
  uploadMaterialPhotos: (loadId: string, materialIndex: number, photos: any[]) =>
    api.post(`/loads/${loadId}/materials/${materialIndex}/photos`, { photos }),
  updateLoadStatus: (loadId: string, status: string) =>
    api.put(`/loads/${loadId}/status`, { status }),
};

export const vehicleAPI = {
  createVehicle: (vehicleData: any) => api.post('/vehicles', vehicleData),
  getMyVehicles: () => api.get('/vehicles'),
  getAvailableVehicles: (params?: any) => api.get('/vehicles/available', { params }),
  getVehicle: (id: string) => api.get(`/vehicles/${id}`),
  uploadVehiclePhotos: (vehicleId: string, photos: any[]) =>
    api.post(`/vehicles/${vehicleId}/photos`, { photos }),
  updateVehicleStatus: (vehicleId: string, status: string) =>
    api.put(`/vehicles/${vehicleId}/status`, { status }),
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
export default api;