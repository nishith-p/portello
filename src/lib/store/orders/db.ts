import { NotFoundError } from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';
import {
  CreateOrderInputExtended,
  CreateOrderItemInput,
  CreateOrderPackItem,
  Order,
  OrderAuditInfo,
  OrderItem,
  OrderItemExtended,
  OrderStatus,
} from '@/lib/store/types';

type OrderWithNestedItems = Omit<Order, 'items'> & {
  order_items: OrderItemExtended[];
};

interface UserInfo {
  first_name: string | null;
  last_name: string | null;
}

interface OrderDatabaseResponse extends OrderWithNestedItems {
  users: UserInfo | null;
}

/**
 * Get all orders with usernames instead of IDs
 */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      id,
      user_id,
      status,
      total_amount,
      created_at,
      updated_at,
      updated_by,
      last_status_change,
      order_items(
        id,
        order_id,
        item_code,
        quantity,
        price,
        size,
        color,
        color_hex,
        name,
        image,
        created_at,
        is_pack,
        parent_pack_id,
        pre_price,
        discount_perc
      ),
      users:user_id (
        first_name,
        last_name
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as unknown as OrderDatabaseResponse[]).map((order) => {
    const userName = order.users
      ? `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim()
      : order.user_id;

    const { users, order_items, ...orderData } = order;

    // Process order items to group pack items with their parents
    const processedItems = processOrderItems(order_items);

    return {
      ...orderData,
      user_id: userName,
      items: processedItems,
    };
  });
}

/**
 * Get orders for a specific user with user names
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      id,
      user_id,
      status,
      total_amount,
      created_at,
      updated_at,
      updated_by,
      last_status_change,
      order_items(
        id,
        order_id,
        item_code,
        quantity,
        price,
        size,
        color,
        color_hex,
        name,
        image,
        created_at,
        is_pack,
        parent_pack_id,
        pre_price,
        discount_perc
      ),
      users:user_id (
        first_name,
        last_name
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as unknown as OrderDatabaseResponse[]).map((order) => {
    const userName = order.users
      ? `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim()
      : order.user_id;

    const { users, order_items, ...orderData } = order;

    // Process order items to group pack items with their parents
    const processedItems = processOrderItems(order_items);

    return {
      ...orderData,
      user_id: userName,
      items: processedItems,
    };
  });
}

/**
 * Get a specific order by ID with user name
 */
export async function getOrder(orderId: string): Promise<Order> {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(
      `
      id,
      user_id,
      status,
      total_amount,
      created_at,
      updated_at,
      updated_by,
      last_status_change,
      order_items(
        id,
        order_id,
        item_code,
        quantity,
        price,
        size,
        color,
        color_hex,
        name,
        image,
        created_at,
        is_pack,
        parent_pack_id,
        pre_price,
        discount_perc
      ),
      users:user_id (
        first_name,
        last_name
      )
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

  const typedData = data as unknown as OrderDatabaseResponse;

  const userName = typedData.users
    ? `${typedData.users.first_name || ''} ${typedData.users.last_name || ''}`.trim()
    : typedData.user_id;

  const { users, order_items, ...orderData } = typedData;

  // Process order items to group pack items with their parents
  const processedItems = processOrderItems(order_items);

  return {
    ...orderData,
    user_id: userName,
    items: processedItems,
  };
}

/**
 * Process order items to organize packs and their items
 */
function processOrderItems(items: OrderItemExtended[]): OrderItem[] {
  if (!items) {
    return [];
  }

  const packItems = items.filter((item) => item.is_pack === true);
  const nonPackItems = items.filter((item) => !item.is_pack || !item.is_pack);
  const childItems = items.filter((item) => item.parent_pack_id != null);

  const packChildrenMap: Record<string, OrderItem[]> = {};

  childItems.forEach((childItem) => {
    if (childItem.parent_pack_id) {
      if (!packChildrenMap[childItem.parent_pack_id]) {
        packChildrenMap[childItem.parent_pack_id] = [];
      }
      packChildrenMap[childItem.parent_pack_id].push(childItem);
    }
  });

  // Add pack_items array to each pack item
  const processedPackItems = packItems.map((packItem) => {
    const packChildren = packChildrenMap[packItem.id] || [];
    return {
      ...packItem,
      pack_items: packChildren,
    } as OrderItemExtended;
  });

  return [...nonPackItems, ...processedPackItems];
}

/**
 * Create a new order
 */
export async function createOrder(orderInput: CreateOrderInputExtended): Promise<Order> {
  const orderData = {
    user_id: orderInput.user_id,
    status: orderInput.status || ('pending' as OrderStatus),
    total_amount: orderInput.total_amount,
    updated_by: orderInput.user_id,
  };

  // Start a transaction
  const { data: newOrder, error: orderError } = await supabaseServer
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  try {
    // Separate pack items and regular items
    const packItems = orderInput.items.filter(
      (item): item is CreateOrderPackItem => 'is_pack' in item && item.is_pack
    );

    const regularItems = orderInput.items.filter(
      (item): item is CreateOrderItemInput => !('is_pack' in item) || !item.is_pack
    );

    // First, insert regular items
    if (regularItems.length > 0) {
      const regularItemsToInsert = regularItems.map((item: CreateOrderItemInput) => ({
        order_id: newOrder.id,
        item_code: item.item_code,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        color: item.color || null,
        color_hex: item.color_hex || null,
        name: item.name || null,
        image: item.image || null,
        pre_price: item.pre_price || 0,
        discount_perc: item.discount_perc || 0,
        is_pack: false,
        pack_code: null, // Explicitly set pack_code to null for regular items
      }));

      const { error: regularItemsError } = await supabaseServer
        .from('order_items')
        .insert(regularItemsToInsert);

      if (regularItemsError) {
        await supabaseServer.from('orders').delete().eq('id', newOrder.id);
        throw regularItemsError;
      }
    }

    // Now handle pack items
    for (const packItem of packItems) {
      // Insert the pack item first
      const { data: insertedPack, error: packError } = await supabaseServer
        .from('order_items')
        .insert({
          order_id: newOrder.id,
          item_code: packItem.item_code,
          pack_code: packItem.item_code,
          quantity: packItem.quantity,
          price: packItem.price,
          name: packItem.name || null,
          image: packItem.image || null,
          pre_price: packItem.pre_price || 0,
          discount_perc: packItem.discount_perc || 0,
          is_pack: true,
        })
        .select()
        .single();

      if (packError) {
        await supabaseServer.from('orders').delete().eq('id', newOrder.id);
        throw packError;
      }

      // Now insert each pack item's children
      if (packItem.pack_items && packItem.pack_items.length > 0) {
        const packChildrenToInsert = packItem.pack_items.map((childItem: CreateOrderItemInput) => ({
          order_id: newOrder.id,
          parent_pack_id: insertedPack.id,
          item_code: childItem.item_code,
          quantity: childItem.quantity,
          price: childItem.price || 0,
          size: childItem.size || null,
          color: childItem.color || null,
          color_hex: childItem.color_hex || null,
          name: childItem.name || null,
          image: childItem.image || null,
          pre_price: 0,
          discount_perc: 0,
          is_pack: false,
          pack_code: null, // Explicitly set pack_code to null for child items
        }));

        const { error: childrenError } = await supabaseServer
          .from('order_items')
          .insert(packChildrenToInsert);

        if (childrenError) {
          await supabaseServer.from('orders').delete().eq('id', newOrder.id);
          throw childrenError;
        }
      }
    }

    return await getOrder(newOrder.id);
  } catch (error) {
    await supabaseServer.from('orders').delete().eq('id', newOrder.id);
    throw error;
  }
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
  const { error } = await supabaseServer
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

  return await getOrder(orderId);
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
