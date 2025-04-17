import { NotFoundError } from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';
import { CreateOrderInput, Order, OrderAuditInfo, OrderItem, OrderStatus } from '@/lib/store/types';

// Define a type for the raw DB response to properly handle the nested order_items
type OrderWithNestedItems = Omit<Order, 'items'> & {
  order_items: OrderItem[];
};

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
  return (data as OrderWithNestedItems[]).map((order) => ({
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
  return (data as OrderWithNestedItems[]).map((order) => ({
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
    ...(data as OrderWithNestedItems),
    items: data.order_items || [],
  };
}

/**
 * Create a new order
 */
export async function createOrder(orderInput: CreateOrderInput): Promise<Order> {
  // Prepare order data for insertion
  const orderData = {
    user_id: orderInput.user_id,
    status: orderInput.status || 'pending',
    total_amount: orderInput.total_amount,
    updated_by: orderInput.user_id, // Initial update is by the creator
  };

  // Insert the order
  const { data: newOrder, error: orderError } = await supabaseServer
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Fetch item details for the order items
  const itemCodes = orderInput.items.map((item) => item.item_code);

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
  (storeItems as StoreItemInfo[]).forEach((item) => {
    storeItemMap[item.item_code] = item;
  });

  // Prepare order items for insertion
  const orderItemsToInsert: Omit<OrderItem, 'id' | 'created_at'>[] = orderInput.items.map(
    (item) => {
      const storeItem = storeItemMap[item.item_code];
      return {
        order_id: newOrder.id,
        item_code: item.item_code,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        color: item.color || null,
        color_hex: item.color_hex || null,
        // Include name and image from the store item if available
        name: storeItem?.name || item.name || null,
        image:
          storeItem?.images && storeItem.images.length > 0
            ? storeItem.images[0]
            : item.image || null,
      };
    }
  );

  // Insert order items
  const { data: insertedItems, error: itemsError } = await supabaseServer
    .from('order_items')
    .insert(orderItemsToInsert)
    .select();

  if (itemsError) {
    // If there's an error, try to rollback by deleting the order
    await supabaseServer.from('orders').delete().eq('id', newOrder.id);
    throw itemsError;
  }

  // Return the complete order with items
  return {
    ...newOrder,
    items: insertedItems as OrderItem[],
    order_items: insertedItems as OrderItem[],
  };
}

/**
 * Update an order's status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  updatedBy: string
): Promise<Order> {
  // Update the order status
  const { data: updatedOrder, error } = await supabaseServer
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

  // Return the complete updated order
  return {
    ...updatedOrder,
    items: orderItems as OrderItem[],
    order_items: orderItems as OrderItem[],
  };
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

  return {
    status: data.status as OrderStatus,
    updated_by: data.updated_by || '',
    last_status_change: data.last_status_change || '',
  };
}
