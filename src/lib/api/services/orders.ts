import { supabaseServer } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types/store';
import { NotFoundError } from '@/lib/api/errors';

/**
 * Get all orders
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Get a specific order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }
  
  return data;
}

/**
 * Create a new order
 */
export async function createOrder(order: Order): Promise<Order> {
  // Start a transaction
  const { data: orderData, error: orderError } = await supabaseServer
    .from('orders')
    .insert({
      user_id: order.user_id,
      status: order.status || 'pending',
      total_amount: order.total_amount,
      shipping_address: order.shipping_address,
      updated_by: order.user_id // Initial update is by the creator
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Fetch item details for the order items
  const itemCodes = order.items.map(item => item.item_code);

  // Get store item data to include name and image
  const { data: storeItems, error: storeItemsError } = await supabaseServer
    .from('store_items')
    .select('item_code, name, images')
    .in('item_code', itemCodes);

  if (storeItemsError) {
    throw storeItemsError;
  }

  // Create a lookup map for store items
  const storeItemMap = storeItems.reduce((map, item) => {
    map[item.item_code] = item;
    return map;
  }, {} as Record<string, { item_code: string, name: string, images: string[] }>);

  // Insert order items with names and images
  const orderItems = order.items.map(item => {
    const storeItem = storeItemMap[item.item_code];
    return {
      order_id: orderData.id,
      item_code: item.item_code,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
      color_hex: item.color_hex,
      // Include name and image from the store item if available
      name: storeItem?.name || item.name || null,
      image: (storeItem?.images && storeItem.images.length > 0) ? storeItem.images[0] : item.image || null
    };
  });

  const { error: itemsError } = await supabaseServer
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    // If there's an error, try to rollback by deleting the order
    await supabaseServer.from('orders').delete().eq('id', orderData.id);
    throw itemsError;
  }

  return { ...orderData, items: orderItems };
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
      updated_by: updatedBy
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
  
  return data;
}

/**
 * Get order audit information (who updated it and when)
 */
export async function getOrderAudit(orderId: string): Promise<{
  status: OrderStatus;
  updated_by: string;
  last_status_change: string;
}> {
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
  
  return data;
}