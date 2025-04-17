/**
 * Store item color representation
 */
export interface StoreItemColor {
  name: string;
  hex: string;
}

/**
 * Store item model
 */
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

/**
 * Input for creating or updating a store item
 */
export interface StoreItemInput {
  item_code: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: StoreItemColor[];
  description: string;
  active: boolean;
}

/**
 * Parameters for searching store items
 */
export interface StoreItemSearchParams {
  search?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Response for a list of store items
 */
export interface StoreItemListResponse {
  items: StoreItem[];
  total: number;
}

/**
 * Standardized API error response
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  };
}

/**
 * Order status options
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/**
 * Order item interface
 */
export interface OrderItem {
  id: string;
  item_code: string;
  order_id: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  name: string | null;
  image: string | null;
  created_at?: string;
}

/**
 * Order interface - matches database schema
 */
export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at?: string;
  updated_by?: string | null; // Made optional since it may be set automatically
  last_status_change?: string;
  order_items?: OrderItem[]; // Made optional for input scenarios
  // Aliased property for compatibility with existing code
  items?: OrderItem[];
}

/**
 * Order audit information
 */
export interface OrderAuditInfo {
  status: OrderStatus;
  updated_by: string;
  last_status_change: string;
}

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  colorHex?: string;
  item_code: string; // Made non-optional since it's needed for orders
}

/**
 * Status color mapping type
 */
export type StatusColorMap = Record<OrderStatus, string>;

/**
 * Input for creating a new order
 */
export interface CreateOrderInput {
  user_id: string;
  status?: OrderStatus;
  total_amount: number;
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[];
}

/**
 * Input for updating an order's status
 */
export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}
