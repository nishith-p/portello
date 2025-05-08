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
  pre_price?: number;
  discount_perc?: number;
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
  pre_price?: number;
  discount_perc?: number;
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
 * Order status options
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'payment pending'
  | 'payment cancelled'
  | 'payment failed'
  | 'charged back'
  | 'failed';

/**
 * Base order item properties common to all order item types
 */
export interface OrderItemBase {
  item_code: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  color_hex?: string | null;
  name?: string | null;
  image?: string | null;
  pre_price?: number;
  discount_perc?: number;
}

/**
 * Order item as stored in the database
 */
export interface OrderItem extends OrderItemBase {
  id: string;
  order_id: string;
  created_at?: string;
}

/**
 * Extended OrderItem with pack-related fields
 */
export interface OrderItemExtended extends OrderItem {
  is_pack?: boolean;
  parent_pack_id?: string | null;
  pack_items?: OrderItem[]; // For pack items, this will contain child items
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
  updated_by?: string | null;
  last_status_change?: string;
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
 * Input for creating a standard order item
 */
export interface CreateOrderItemInput extends OrderItemBase {
  // No additional fields needed
}

/**
 * Input for creating a pack item in an order
 */
export interface CreateOrderPackItem {
  item_code: string; // This will be the pack_code
  quantity: number;
  price: number;
  pre_price?: number;
  discount_perc?: number;
  name?: string | null;
  image?: string | null;
  is_pack: true;
  pack_items: CreateOrderItemInput[]; // Use the base input type for pack items
  optional_items?: CreateOrderItemInput[]; // Optional items the user can choose from
  selected_optional_item?: CreateOrderItemInput | null; // The selected optional item
}

/**
 * Input for creating an order with support for pack items
 */
export interface CreateOrderInputExtended {
  user_id: string;
  status?: OrderStatus;
  total_amount: number;
  items: (CreateOrderItemInput | CreateOrderPackItem)[];
}

/**
 * Status color mapping type
 */
export type StatusColorMap = Record<OrderStatus, string>;

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  item_code: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  colorHex?: string;
  pre_price?: number;
  discount_perc?: number;
}

/**
 * Individual item details within a cart pack
 */
export interface CartPackItemDetail {
  item_id: string;
  item_code: string;
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  colorHex?: string;
  image?: string;
  pre_price?: number;
  discount_perc?: number;
  is_optional?: boolean;
  price?: number;
}

/**
 * Cart pack item - extends CartItem with size/color selections for each item
 */
export interface CartPackItem {
  id: string;
  pack_id: string;
  pack_code: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  pack_items: CartPackItemDetail[];
  optional_items?: CartPackItemDetail[];
  selected_optional_item?: (CartPackItemDetail & { price?: number }) | null;
  pre_price?: number;
  discount_perc?: number;
}

/**
 * Store pack model
 */
export interface StorePack {
  id: string;
  pack_code: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  pack_items?: StorePackItem[];
  pre_price?: number;
  discount_perc?: number;
}

/**
 * Store pack item (junction between pack and item)
 */
export interface StorePackItem {
  id: string;
  pack_id: string;
  item_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  item?: StoreItem;
  pre_price?: number;
  discount_perc?: number;
  is_optional: boolean;
}

/**
 * Input for creating or updating a store pack
 */
export interface StorePackInput {
  pack_code: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  active: boolean;
  pre_price?: number;
  discount_perc?: number;
}

/**
 * Input for pack items when creating or updating a pack
 */
export interface StorePackItemInput {
  item_id: string;
  quantity: number;
  is_optional?: boolean;
}

/**
 * Full pack input with items
 */
export interface StorePackWithItemsInput extends StorePackInput {
  pack_items: StorePackItemInput[];
}

/**
 * Parameters for searching store packs
 */
export interface StorePackSearchParams {
  search?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Response for a list of store packs
 */
export interface StorePackListResponse {
  packs: StorePack[];
  total: number;
}

/**
 * Response for a list of item quantities
 */
export interface ItemWithQuantity {
  item_code: string;
  name: string;
  quantity: number;
  active: boolean;
}

export interface PackWithQuantity {
  pack_code: string;
  name: string;
  quantity: number;
  active: boolean;
}

/**
 * Parameters for searching item quantities
 */
export interface ItemQuantitySearchParams {
  search?: string;
  limit: number;
  offset: number;
}

export interface OptionalItem {
  item_code: unknown;
  quantity?: unknown;
  price?: unknown;
  size?: unknown;
  color?: unknown;
  color_hex?: unknown;
  colorHex?: unknown;
  name?: unknown;
  image?: unknown;
}

export function isOptionalItem(obj: unknown): obj is OptionalItem {
  return typeof obj === 'object' && obj !== null && 'item_code' in obj;
}
