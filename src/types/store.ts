// Types for the store items and cart functionality

// Store item types
export interface Item {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
}

// Store item in database
export interface StoreItem {
  id?: string;
  item_code: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  size?: string;
  color?: string;
  colorHex?: string;
  quantity: number;
  image?: string;
}

// Order status types
export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'delivered' | 'cancelled';

// Order item in database
export interface OrderItem {
  item_code: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  color_hex?: string;
  name?: string;  // Item name at time of order
  image?: string; // Item image at time of order
}

// Order in database
export interface Order {
  id?: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
  updated_by?: string; // User who last updated the order
  last_status_change?: string; // When the status was last changed
  items: OrderItem[];
}