// Define types for store items
export interface StoreItemColor {
  name: string;
  hex: string;
}

export interface StoreItem {
  id: string;
  item_code: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: StoreItemColor[];
  description: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

// For creating or updating a store item
export interface StoreItemInput {
  item_code: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: StoreItemColor[];
  description: string;
  active?: boolean;
}

// Request parameters for search and filtering
export interface StoreItemSearchParams {
  search?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
}

// API response structures
export interface StoreItemListResponse {
  items: StoreItem[];
  total: number;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

// Order status options
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Order item interface
export interface OrderItem {
  id: string;
  item_code: string;
  order_id: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  color_hex?: string | null;
  name?: string | null;
  image?: string | null;
  created_at?: string;
}

// Order interface - Updated to match database schema without shipping_address
export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at?: string;
  updated_by?: string | null;
  last_status_change?: string;
  order_items: OrderItem[];
  // Aliased property for compatibility with existing code
  items?: OrderItem[];
}

// Order audit information
export interface OrderAuditInfo {
  status: OrderStatus;
  updated_by: string;
  last_status_change: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  colorHex?: string;
  item_code?: string;
}

// Status color mapping
export type StatusColorMap = Record<OrderStatus, string>;
