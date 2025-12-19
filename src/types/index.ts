// Admin Types
export interface Admin {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  token?: string;
}

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminRegistrationDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
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
}

// Vendor Types
export interface LicenseDocument {
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface Vendor {
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
