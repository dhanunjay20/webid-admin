// Admin Types
export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  country: 'USA' | 'India';
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Admin;
}

export interface AdminLoginDto {
  identifier: string; // email or phone
  password: string;
}

export interface AdminRegistrationDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'ADMIN' | 'MODERATOR' | 'SUPER_ADMIN';
  country: 'USA' | 'India';
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  totalBids: number;
  totalMenuItems: number;
  totalPayments: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  activeVendors: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// User Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  addresses: Address[];
  profileUrl?: string;
  latitude?: number;
  longitude?: number;
  lastLocationUpdatedAt?: string;
  stripeCustomerId?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  userType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserStatusDto {
  status: string;
  reason?: string;
}

// Vendor Types
export interface LicenseDocument {
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface Vendor {
  vendorId?: string;
  id: string;
  vendorOrganizationId: string;
  businessName: string;
  contactName: string;
  email: string;
  mobile: string;
  addresses: Address[];
  licenseDocuments: LicenseDocument[];
  isOnline?: boolean;
  lastSeenAt?: string;
  website?: string;
  yearsInBusiness?: number;
  aboutBusiness?: string;
  latitude?: number;
  longitude?: number;
  lastLocationUpdatedAt?: string;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  status?: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  // Extended details (optional)
  cuisinesOffered?: string[];
  specialties?: string[];
  capacity?: {
    minGuests?: number;
    maxGuests?: number;
    concurrentEvents?: number;
  };
  pricing?: {
    currency?: string;
    startingPricePerPlate?: number;
    averagePricePerPlate?: number;
  };
  ratings?: {
    averageRating?: number;
    totalReviews?: number;
  };
  stats?: {
    totalOrders?: number;
    completedOrders?: number;
  };
  ownerInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    idProofType?: string;
    idProofNumber?: string;
  };
  serviceAreas?: Array<{ city?: string; state?: string; radiusKm?: number }>;
  documents?: Array<{
    documentId?: string;
    documentType?: string;
    documentName?: string;
    documentUrl?: string;
    documentNumber?: string;
    issueDate?: string;
    expiryDate?: string | null;
    verificationStatus?: string;
    uploadedAt?: string;
  }>;
  country?: string;
  verified?: boolean;
  featured?: boolean;
}

export interface ApproveVendorDto {
  vendorId: string;
}

export interface RejectVendorDto {
  vendorId: string;
  reason: string;
}

// Order Types
export interface OrderMenuItem {
  menuItemId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorOrganizationId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  menuItems: OrderMenuItem[];
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  vendorName?: string;
}

// Bid Types
export interface Bid {
  id: string;
  orderId: string;
  vendorOrganizationId: string;
  proposedMessage: string;
  proposedTotalPrice: number;
  status: string;
  submittedAt: string;
  updatedAt: string;
  customerName?: string;
  vendorBusinessName?: string;
  eventName?: string;
}

// Menu Item Types
export interface MenuItem {
  id: string;
  vendorOrganizationId: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  subCategory: string;
  ingredients: string[];
  spiceLevels: string[];
  available: boolean;
  vendorName?: string;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  vendorOrganizationId: string;
  stripePaymentIntentId: string;
  stripeCustomerId: string;
  stripeChargeId: string;
  amountInCents: number;
  currency: string;
  status: string;
  paidAt: string;
  createdAt: string;
  customerName?: string;
  vendorName?: string;
}

// Platform Configuration Types
export interface PlatformConfig {
  id: string;
  country: string;
  currency: string;
  platformFeePercentage: number;
  taxRate: number;
  minOrderAmount: number;
  maxOrderAmount: number;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePlatformConfigRequest {
  currency?: string;
  platformFeePercentage?: number;
  taxRate?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  supportEmail?: string;
  supportPhone?: string;
  maintenanceMode?: boolean;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedByName?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  createdAt: string;
}

export interface AuditLogFilters {
  entityType?: string;
  action?: string;
  performedBy?: string;
  startDate?: string;
  endDate?: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT' | 'MAINTENANCE';
  targetAudience: 'ALL' | 'USERS' | 'VENDORS' | 'ADMINS';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT' | 'MAINTENANCE';
  targetAudience: 'ALL' | 'USERS' | 'VENDORS' | 'ADMINS';
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
