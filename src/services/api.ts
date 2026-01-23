import axios from 'axios';
import type {
  Admin,
  AdminLoginDto,
  AdminRegistrationDto,
  AuthResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
  DashboardStats,
  User,
  UpdateUserStatusDto,
  Vendor,
  ApproveVendorDto,
  RejectVendorDto,
  Order,
  Bid,
  MenuItem,
  Payment,
  PlatformConfig,
  UpdatePlatformConfigRequest,
  AuditLog,
  AuditLogFilters,
  Announcement,
  CreateAnnouncementRequest,
  PaginationParams,
} from '../types';

// Use VITE_API_BASE_URL when provided; otherwise use relative paths so Vite dev proxy can forward requests and avoid CORS.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken: newAccessToken } = response.data;
        localStorage.setItem('accessToken', newAccessToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== Admin Authentication ====================

export const adminApi = {
  register: (data: AdminRegistrationDto): Promise<AuthResponse> =>
    api.post('/api/v1/auth/register', data).then(res => res.data),

  login: (data: AdminLoginDto): Promise<AuthResponse> =>
    api.post('/api/v1/auth/login', data).then(res => res.data),

  forgotPassword: (data: ForgotPasswordDto): Promise<{ message: string }> =>
    api.post('/api/v1/auth/forgot-password', data).then(res => res.data),

  resetPassword: (data: ResetPasswordDto): Promise<{ message: string }> =>
    api.post('/api/v1/auth/reset-password', data).then(res => res.data),

  recoverEmail: (phone: string): Promise<{ email: string }> =>
    api.get(`/api/v1/auth/recover/forgot-email?phone=${phone}`).then(res => res.data),

  recoverPhone: (email: string): Promise<{ phone: string }> =>
    api.get(`/api/v1/auth/recover/forgot-phone?email=${email}`).then(res => res.data),

  refreshToken: (refreshToken: string): Promise<{ accessToken: string }> =>
    api.post('/api/v1/auth/refresh', { refreshToken }).then(res => res.data),

  getAdminById: (id: string): Promise<Admin> =>
    api.get(`/admin/${id}`).then(res => res.data),

  getAllAdmins: (): Promise<Admin[]> =>
    api.get('/admin').then(res => res.data),
};

// ==================== Dashboard ====================

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    api.get('/admin/dashboard').then(res => res.data),
};

// ==================== User Management ====================

export const userApi = {
  getAllUsers: (params?: PaginationParams & { status?: string; userType?: string }): Promise<{ data: User[]; total: number }> =>
    api.get('/admin/users', { params }).then(res => res.data),

  getUserById: (id: string): Promise<User> =>
    api.get(`/admin/users/${id}`).then(res => res.data),

  updateUserStatus: (userId: string, data: UpdateUserStatusDto): Promise<User> =>
    api.patch(`/admin/users/${userId}/status`, null, { 
      params: { status: data.status, reason: data.reason } 
    }).then(res => res.data),

  deleteUser: (id: string): Promise<void> =>
    api.delete(`/admin/users/${id}`).then(res => res.data),
};

// ==================== Vendor Management ====================

export const vendorApi = {
  // Normalize vendor payloads to ensure `id` exists (backend may return `vendorId`)
  getAllVendors: async (params?: PaginationParams & { status?: string }) => {
    const res = await api.get('/api/v1/vendors', { params });
    const payload: any = res.data;
    const normalize = (v: any) => ({ ...v, id: v.id || v.vendorId });

    if (Array.isArray(payload)) {
      return { data: payload.map(normalize), total: payload.length };
    }

    if (payload && payload.data) {
      return { data: payload.data.map(normalize), total: payload.total || payload.data.length };
    }

    // Fallback: single object
    return { data: [normalize(payload)], total: 1 };
  },

  // params may include pagination and an accessCode required by the admin pending endpoint
  getPendingVendors: async (params?: PaginationParams & { accessCode?: string }) => {
    const res = await api.get('/api/v1/vendors/admin/pending', { params });
    const payload: any = res.data;
    const normalize = (v: any) => ({ ...v, id: v.id || v.vendorId });
    if (Array.isArray(payload)) return payload.map(normalize);
    if (payload && payload.data) return payload.data.map(normalize);
    return [normalize(payload)];
  },

  getVendorById: async (id: string) => {
    const res = await api.get(`/api/v1/vendors/${id}`);
    const v: any = res.data;
    return { ...v, id: v.id || v.vendorId };
  },

  approveVendor: (vendorId: string): Promise<any> =>
    api.post(`/api/v1/vendors/${vendorId}/approve`).then(res => res.data),

  rejectVendor: (vendorId: string, reason: string): Promise<any> =>
    api.post(`/api/v1/vendors/${vendorId}/reject`, null, { params: { reason } }).then(res => res.data),

  updateVendorStatus: (id: string, isActive: boolean): Promise<any> =>
    api.put(`/api/v1/vendors/${id}/status`, null, { params: { isActive } }).then(res => res.data),

  deleteVendor: (id: string): Promise<void> =>
    api.delete(`/api/v1/vendors/${id}`).then(res => res.data),
};

// ==================== Order Management ====================

export const orderApi = {
  getAllOrders: (params?: PaginationParams & { status?: string }): Promise<{ data: Order[]; total: number }> =>
    api.get('/admin/orders', { params }).then(res => res.data),

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

// ==================== Platform Configuration ====================

export const platformConfigApi = {
  getConfig: (country: string = 'India'): Promise<PlatformConfig> =>
    api.get('/admin/platform-config', { params: { country } }).then(res => res.data),

  updateConfig: (data: UpdatePlatformConfigRequest): Promise<PlatformConfig> =>
    api.put('/admin/platform-config', data).then(res => res.data),
};

// ==================== Audit Logs ====================

export const auditLogApi = {
  getAuditLogs: (filters?: AuditLogFilters & PaginationParams): Promise<{ data: AuditLog[]; total: number }> =>
    api.get('/admin/audit-logs', { params: filters }).then(res => res.data),
};

// ==================== Announcements ====================

export const announcementApi = {
  getAll: (): Promise<Announcement[]> =>
    api.get('/admin/announcements').then(res => res.data),

  create: (data: CreateAnnouncementRequest): Promise<Announcement> =>
    api.post('/admin/announcements', data).then(res => res.data),

  delete: (announcementId: string): Promise<void> =>
    api.delete(`/admin/announcements/${announcementId}`).then(res => res.data),
};

export default api;
