export type UserRole = 'customer' | 'vendor';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  licenseNumber: string;
  address: string;
  phone: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  addresses: Address[];
  phone: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  brand: string;
  composition: string;
  price: number;
  quantity: number;
  batchNumber: string;
  expiryDate: Date;
  requiresPrescription: boolean;
  imageUrl: string;
  lowStockThreshold: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
}

export interface CartItem extends OrderItem {
  vendorId: string;
  vendorName: string;
  requiresPrescription: boolean;
}
