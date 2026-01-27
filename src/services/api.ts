import axios from 'axios';
import type {
  Admin,
  AdminLoginDto,
  AdminRegistrationDto,
  AuthResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
  Vendor,
  User,
  UpdateUserStatusDto,
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

// ==================== Vendor Management ====================

export const vendorApi = {
  // Get all vendors (uses users endpoint with role=VENDOR)
  getAllVendors: async (): Promise<Vendor[]> => {
    const res = await api.get('/api/v1/users', { params: { role: 'VENDOR' } });
    const payload: any = res.data;

    const normalize = (u: any): Vendor => {
      const fullName = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim();
      return {
          vendorId: u.vendorId || u.userId || u.id || '',
          id: u.vendorId || u.userId || u.id || '',
        vendorOrganizationId: u.vendorOrganizationId || u.organizationId || '',
        businessName: u.businessName || fullName || 'Unknown Vendor',
        contactName: u.contactName || fullName || '',
        email: u.email,
        mobile: u.phone || u.mobile,
        addresses: u.addresses || [],
        licenseDocuments: u.licenseDocuments || [],
        isOnline: u.isOnline,
        lastSeenAt: u.lastSeenAt || u.lastLocationUpdatedAt,
        website: u.website,
        yearsInBusiness: u.yearsInBusiness,
        aboutBusiness: u.aboutBusiness || u.description,
        latitude: u.latitude,
        longitude: u.longitude,
        lastLocationUpdatedAt: u.lastLocationUpdatedAt,
        approvalStatus: u.approvalStatus || u.vendorApprovalStatus,
        status: u.status,
        rejectionReason: u.rejectionReason,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      } as Vendor;
    };

    if (Array.isArray(payload)) {
      return payload.map(normalize);
    }

    if (payload && payload.data) {
      return payload.data.map(normalize);
    }

    // Fallback: single object
    return [normalize(payload)];
  },

  // Get pending vendors (admin endpoint) — accepts only accessCode
  getPendingVendors: async (opts?: { accessCode?: string }): Promise<Vendor[]> => {
    const res = await api.get('/api/v1/vendors/admin/pending', { params: opts });
    const payload: any = res.data;
    const normalize = (v: any) => ({ ...v, id: v.id || v.vendorId });

    if (Array.isArray(payload)) return payload.map(normalize);
    if (payload && payload.data) return payload.data.map(normalize);
    return [normalize(payload)];
  },

  // Approve a vendor by ID
  approveVendor: (vendorId: string): Promise<any> =>
    api.post(`/api/v1/vendors/${vendorId}/approve`).then(res => res.data),

  // Reject a vendor by ID with reason
  rejectVendor: (vendorId: string, reason: string): Promise<any> =>
    api.post(`/api/v1/vendors/${vendorId}/reject`, null, { params: { reason } }).then(res => res.data),
  // Get full vendor details
  getVendorDetails: async (vendorId: string): Promise<Vendor> => {
    const res = await api.get(`/api/v1/vendors/${vendorId}`);
    const payload: any = res.data;
    const v = payload && payload.data ? payload.data : payload;

    const normalize = (u: any): Vendor => {
      const fullName = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim();
      return {
          vendorId: u.vendorId || u.userId || u.id || '',
          id: u.userId || u.id || u.vendorId || '',
        businessName: u.businessName || fullName || 'Unknown Vendor',
        contactName: u.contactName || fullName || '',
        email: u.businessEmail || u.registeredEmail || u.email,
        mobile: u.businessPhone || u.registeredPhone || u.phone || u.mobile,
        addresses: u.businessAddress ? [
          {
            street: u.businessAddress.streetAddress || u.businessAddress.street || '',
            city: u.businessAddress.city || '',
            state: u.businessAddress.state || '',
            zipCode: u.businessAddress.postalCode || u.businessAddress.zipCode || '',
            country: u.businessAddress.country || '',
          }
        ] : (u.addresses || []),
        licenseDocuments: u.documents || u.licenseDocuments || [],
        isOnline: u.isOnline,
        lastSeenAt: u.lastSeenAt || u.lastLocationUpdatedAt,
        website: u.website,
        yearsInBusiness: u.establishedYear || u.yearsInBusiness,
        aboutBusiness: u.description || u.aboutBusiness,
        latitude: u.latitude,
        longitude: u.longitude,
        lastLocationUpdatedAt: u.lastLocationUpdatedAt,
        approvalStatus: u.approvalStatus || u.vendorApprovalStatus,
        status: u.status,
        rejectionReason: u.rejectionReason,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        cuisinesOffered: u.cuisinesOffered || u.cuisines || [],
        specialties: u.specialties || [],
        capacity: u.capacity || u.capacities,
        pricing: u.pricing,
        ratings: u.ratings,
        stats: u.stats,
        ownerInfo: u.ownerInfo,
        serviceAreas: u.serviceAreas,
        documents: u.documents,
        country: u.country,
        verified: u.verified,
        featured: u.featured,
      } as Vendor;
    };

    return normalize(v);
  },
};

// ==================== User Management ====================

export const userApi = {
  // Get all users with optional pagination and role filter
  getAllUsers: async (params?: PaginationParams & { role?: string }): Promise<{ data: User[]; total: number }> => {
    const res = await api.get('/api/v1/users', { params });
    const payload: any = res.data;

    const normalize = (u: any): User => {
      const fullName = u.fullName || '';
      const firstName = u.firstName || fullName.split(' ')[0] || '';
      const lastName = u.lastName || fullName.split(' ').slice(1).join(' ') || '';

      return {
        id: u.userId || u.id,
        firstName,
        lastName,
        email: u.email,
        mobile: u.phone || u.mobile,
        addresses: u.addresses || [],
        profileUrl: u.profileUrl,
        latitude: u.latitude,
        longitude: u.longitude,
        lastLocationUpdatedAt: u.lastLocationUpdatedAt,
        stripeCustomerId: u.stripeCustomerId,
        status: u.status,
        userType: u.userType,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      } as User;
    };

    if (Array.isArray(payload)) {
      return { data: payload.map(normalize), total: payload.length };
    }

    if (payload && payload.data) {
      return { data: payload.data.map(normalize), total: payload.total || payload.data.length };
    }

    return { data: [normalize(payload)], total: 1 };
  },

  // Update user status
  updateUserStatus: (userId: string, data: UpdateUserStatusDto): Promise<User> =>
    api.patch(`/api/v1/users/${userId}/status`, null, { 
      params: { status: data.status, reason: data.reason } 
    }).then(res => res.data),
};

// ==================== Menu Management ====================

interface Category {
  id?: string;
  categoryName: string;
  categoryNameHindi?: string;
  description?: string;
  displayOrder?: number;
  iconUrl?: string;
}

interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  servingSizeGrams: number;
}

interface MasterMenuItem {
  id?: string;
  itemName: string;
  itemNameHindi?: string;
  description: string;
  categoryId: string;
  cuisineType: string;
  foodType: string;
  spiceLevel: string;
  dietaryTags?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  imageUrls?: string[];
  isPopular?: boolean;
  status?: string;
}

export const menuApi = {
  // Create category
  createCategory: (data: Category): Promise<Category> =>
    api.post('/api/v1/admin/categories', data).then(res => {
      const payload = res.data;
      // Backend returns nested structure: { success, status, message, data, timestamp }
      return payload.data || payload;
    }),

  // Get all categories
  getAllCategories: (): Promise<Category[]> =>
    api.get('/api/v1/menu/categories').then(res => {
      const payload = res.data;
      return payload.data || payload;
    }),

  // Create master menu item
  createMenuItem: (data: MasterMenuItem): Promise<MasterMenuItem> =>
    api.post('/api/v1/admin/menu-items', data).then(res => {
      const payload = res.data;
      // Backend returns nested structure: { success, status, message, data, timestamp }
      return payload.data || payload;
    }),

  // Get all menu items
  getAllMenuItems: (): Promise<MasterMenuItem[]> =>
    api.get('/api/v1/menu/items').then(res => {
      const payload = res.data;
      return payload.data || payload;
    }),
};

export default api;
