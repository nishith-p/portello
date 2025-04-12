import { NotFoundError } from '@/lib/api/errors';
import { supabaseServer } from '@/lib/supabase';
import { Order, OrderAuditInfo, OrderItem, OrderStatus } from '@/types/store';

/**
 * Get all orders
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      *,
      order_items(*)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Transform the response to match the Order interface
  return data.map((order) => ({
    ...order,
    items: order.order_items || [],
  }));
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      *,
      order_items(*)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Transform the response to match the Order interface
  return data.map((order) => ({
    ...order,
    items: order.order_items || [],
  }));
}

/**
 * Get a specific order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      *,
      order_items(*)
    `
    )
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }

  // Transform the response to match the Order interface
  return {
    ...data,
    items: data.order_items || [],
  };
}

/**
 * Create a new order
 */
export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'order_items'> & {
    items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[];
  }
): Promise<Order> {
  // Start a transaction
  const { data: orderData, error: orderError } = await supabaseServer
    .from('orders')
    .insert({
      user_id: order.user_id,
      status: order.status || 'pending',
      total_amount: order.total_amount,
      updated_by: order.user_id, // Initial update is by the creator
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Fetch item details for the order items
  const itemCodes = order.items.map((item) => item.item_code);

  // Get store item data to include name and image
  const { data: storeItems, error: storeItemsError } = await supabaseServer
    .from('store_items')
    .select('item_code, name, images')
    .in('item_code', itemCodes);

  if (storeItemsError) {
    throw storeItemsError;
  }

  interface StoreItemInfo {
    item_code: string;
    name: string;
    images: string[];
  }

  // Create a lookup map for store items
  const storeItemMap: Record<string, StoreItemInfo> = {};

  storeItems.forEach((item: StoreItemInfo) => {
    storeItemMap[item.item_code] = item;
  });

  // Insert order items with names and images
  const orderItems: Omit<OrderItem, 'id' | 'created_at'>[] = order.items.map((item) => {
    const storeItem = storeItemMap[item.item_code];
    return {
      order_id: orderData.id,
      item_code: item.item_code,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null,
      color_hex: item.color_hex || null,
      // Include name and image from the store item if available
      name: storeItem?.name || item.name || null,
      image:
        storeItem?.images && storeItem.images.length > 0 ? storeItem.images[0] : item.image || null,
    };
  });

  const { error: itemsError } = await supabaseServer.from('order_items').insert(orderItems);

  if (itemsError) {
    // If there's an error, try to rollback by deleting the order
    await supabaseServer.from('orders').delete().eq('id', orderData.id);
    throw itemsError;
  }

  return { ...orderData, items: orderItems as OrderItem[] };
}

/**
 * Update an order's status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  updatedBy: string
): Promise<Order> {
  const { data, error } = await supabaseServer
    .from('orders')
    .update({
      status,
      updated_by: updatedBy,
      // last_status_change will be updated automatically by the trigger
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }

  // Get the order items
  const { data: orderItems, error: itemsError } = await supabaseServer
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) {
    throw itemsError;
  }

  return { ...data, items: orderItems || [] };
}

/**
 * Get order audit information (who updated it and when)
 */
export async function getOrderAudit(orderId: string): Promise<OrderAuditInfo> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select('status, updated_by, last_status_change')
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }

  return data as OrderAuditInfo;
}
