import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('xbow_admin_token');
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
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('xbow_admin_token');
      Cookies.remove('xbow_admin_user');
      window.location.href = '/admin/login';
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Auth
  login: (credentials: any) => adminApi.post('/admin/login', credentials),
  register: (adminData: any) => adminApi.post('/admin/register', adminData),
  
  // Profile Management
  getProfile: () => adminApi.get('/admin/profile'),
  updateProfile: (data: any) => adminApi.put('/admin/profile', data),
  changePassword: (data: any) => adminApi.put('/admin/change-password', data),
  
  // Dashboard
  getDashboardStats: () => adminApi.get('/admin/dashboard'),
  
  // User Management
  getUsers: (params?: any) => adminApi.get('/admin/users', { params }),
  approveUser: (userId: string, data: any) => adminApi.put(`/admin/users/${userId}/approve`, data),
  rejectUser: (userId: string, data: any) => adminApi.put(`/admin/users/${userId}/reject`, data),
  toggleUserAccess: (userId: string) => adminApi.put(`/admin/users/${userId}/toggle-access`),
  
  // Load Management
  getLoads: (params?: any) => adminApi.get('/admin/loads', { params }),
  matchLoadWithVehicle: (data: any) => adminApi.post('/admin/match-loads', data),
  
  // Vehicle Management
  getVehicles: (params?: any) => adminApi.get('/admin/vehicles', { params }),
  approveVehicle: (vehicleId: string) => adminApi.put(`/admin/vehicles/${vehicleId}/approve`),
  rejectVehicle: (vehicleId: string, data: any) => adminApi.put(`/admin/vehicles/${vehicleId}/reject`, data),
  
  // POD Management
  getPODs: (params?: any) => adminApi.get('/admin/pods', { params }),
  approvePOD: (podId: string, data: any) => adminApi.put(`/admin/pods/${podId}/approve`, data),
  rejectPOD: (podId: string, data: any) => adminApi.put(`/admin/pods/${podId}/reject`, data),
  
  // Payment Management
  getPayments: (params?: any) => adminApi.get('/admin/payments', { params }),
  
  // Commission Management
  getCommissionReports: (params?: any) => adminApi.get('/admin/commission', { params }),
  
  // Settings
  getAdminSettings: () => adminApi.get('/admin/settings'),
  updateAdminSettings: (data: any) => adminApi.put('/admin/settings', data),
  
  // Reports
  generateReport: (type: string, params?: any) => adminApi.get(`/admin/reports/${type}`, { params }),
};

export default adminApi;