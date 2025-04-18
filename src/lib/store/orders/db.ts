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

// Define types for the raw DB responses to properly handle the nested order_items
type OrderWithNestedItems = Omit<Order, 'items'> & {
  order_items: OrderItemExtended[];
};

// Define the user information returned from the database
interface UserInfo {
  first_name: string | null;
  last_name: string | null;
}

// Define the full database response structure
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
        parent_pack_id
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
        parent_pack_id
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
        parent_pack_id
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

  // First, find all pack items
  const packItems = items.filter((item) => item.is_pack === true);
  const nonPackItems = items.filter((item) => !item.is_pack || !item.is_pack);

  // Find all child items of pack items
  const childItems = items.filter((item) => item.parent_pack_id != null);

  // Create a map of pack IDs to their child items
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

  // Return the non-pack items plus the processed pack items
  return [...nonPackItems, ...processedPackItems];
}

/**
 * Create a new order
 */
/**
 * Create a new order
 */
export async function createOrder(orderInput: CreateOrderInputExtended): Promise<Order> {
  // Prepare order data for insertion
  const orderData = {
    user_id: orderInput.user_id,
    status: orderInput.status || ('pending' as OrderStatus),
    total_amount: orderInput.total_amount,
    updated_by: orderInput.user_id, // Initial update is by the creator
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
        is_pack: false,
        pack_code: null, // Explicitly set pack_code to null for regular items
      }));

      const { error: regularItemsError } = await supabaseServer
        .from('order_items')
        .insert(regularItemsToInsert);

      if (regularItemsError) {
        // Rollback by deleting the order
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
          item_code: packItem.item_code, // This is needed for existing code compatibility
          pack_code: packItem.item_code, // Store the pack code in the dedicated column
          quantity: packItem.quantity,
          price: packItem.price,
          name: packItem.name || null,
          image: packItem.image || null,
          is_pack: true,
        })
        .select()
        .single();

      if (packError) {
        // Rollback by deleting the order
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
          is_pack: false,
          pack_code: null, // Explicitly set pack_code to null for child items
        }));

        const { error: childrenError } = await supabaseServer
          .from('order_items')
          .insert(packChildrenToInsert);

        if (childrenError) {
          // Rollback by deleting the order
          await supabaseServer.from('orders').delete().eq('id', newOrder.id);
          throw childrenError;
        }
      }
    }

    // Fetch the complete order with all items
    return await getOrder(newOrder.id);
  } catch (error) {
    // Ensure order is deleted if anything fails
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

  // Return the complete updated order (using getOrder to process items correctly)
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
