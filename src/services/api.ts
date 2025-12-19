import axios from 'axios';
import type {
  Admin,
  AdminLoginDto,
  AdminRegistrationDto,
  DashboardStats,
  User,
  Vendor,
  Order,
  Bid,
  MenuItem,
  Payment
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
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
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Admin Authentication ====================

export const adminApi = {
  register: (data: AdminRegistrationDto): Promise<Admin> =>
    api.post('/admin/register', data).then(res => res.data),

  login: (data: AdminLoginDto): Promise<Admin> =>
    api.post('/admin/login', data).then(res => res.data),

  getAdminById: (id: string): Promise<Admin> =>
    api.get(`/admin/${id}`).then(res => res.data),

  getAllAdmins: (): Promise<Admin[]> =>
    api.get('/admin').then(res => res.data),
};

// ==================== Dashboard ====================

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    api.get('/admin/dashboard/stats').then(res => res.data),
};

// ==================== User Management ====================

export const userApi = {
  getAllUsers: (): Promise<User[]> =>
    api.get('/admin/users').then(res => res.data),

  getUserById: (id: string): Promise<User> =>
    api.get(`/admin/users/${id}`).then(res => res.data),

  deleteUser: (id: string): Promise<void> =>
    api.delete(`/admin/users/${id}`).then(res => res.data),
};

// ==================== Vendor Management ====================

export const vendorApi = {
  getAllVendors: (): Promise<Vendor[]> =>
    api.get('/admin/vendors').then(res => res.data),

  getVendorById: (id: string): Promise<Vendor> =>
    api.get(`/admin/vendors/${id}`).then(res => res.data),

  updateVendorStatus: (id: string, isActive: boolean): Promise<Vendor> =>
    api.put(`/admin/vendors/${id}/status`, null, { params: { isActive } }).then(res => res.data),

  deleteVendor: (id: string): Promise<void> =>
    api.delete(`/admin/vendors/${id}`).then(res => res.data),
};

// ==================== Order Management ====================

export const orderApi = {
  getAllOrders: (): Promise<Order[]> =>
    api.get('/admin/orders').then(res => res.data),

  getOrderById: (id: string): Promise<Order> =>
    api.get(`/admin/orders/${id}`).then(res => res.data),

  updateOrderStatus: (id: string, status: string): Promise<Order> =>
    api.put(`/admin/orders/${id}/status`, null, { params: { status } }).then(res => res.data),

  deleteOrder: (id: string): Promise<void> =>
    api.delete(`/admin/orders/${id}`).then(res => res.data),
};

// ==================== Bid Management ====================

export const bidApi = {
  getAllBids: (): Promise<Bid[]> =>
    api.get('/admin/bids').then(res => res.data),

  getBidById: (id: string): Promise<Bid> =>
    api.get(`/admin/bids/${id}`).then(res => res.data),

  deleteBid: (id: string): Promise<void> =>
    api.delete(`/admin/bids/${id}`).then(res => res.data),
};

// ==================== Menu Item Management ====================

export const menuItemApi = {
  getAllMenuItems: (): Promise<MenuItem[]> =>
    api.get('/admin/menu-items').then(res => res.data),

  getMenuItemById: (id: string): Promise<MenuItem> =>
    api.get(`/admin/menu-items/${id}`).then(res => res.data),

  deleteMenuItem: (id: string): Promise<void> =>
    api.delete(`/admin/menu-items/${id}`).then(res => res.data),
};

// ==================== Payment Management ====================

export const paymentApi = {
  getAllPayments: (): Promise<Payment[]> =>
    api.get('/admin/payments').then(res => res.data),

  getPaymentById: (id: string): Promise<Payment> =>
    api.get(`/admin/payments/${id}`).then(res => res.data),
};

export default api;
