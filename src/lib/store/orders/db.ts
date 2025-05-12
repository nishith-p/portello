import { NotFoundError } from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';
import {
  CreateOrderInputExtended,
  CreateOrderItemInput,
  CreateOrderPackItem,
  ItemQuantitySearchParams,
  ItemSizeColorQuantity,
  ItemWithQuantity,
  Order,
  OrderAuditInfo,
  OrderItem,
  OrderItemExtended,
  OrderStatus,
  PackWithQuantity,
} from '@/lib/store/types';
import { getActiveStoreItems } from '../items/db';
import { getActiveStorePacks } from '../packs/db';

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
 * Get a specific order for a specific user, including user names
 */
export async function getUserOrderById(userId: string | undefined, orderId: string): Promise<Order> {
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
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} for user ${userId} not found`);
    }
    throw error;
  }

  const typedData = data as unknown as OrderDatabaseResponse;

  const userName = typedData.users
    ? `${typedData.users.first_name || ''} ${typedData.users.last_name || ''}`.trim()
    : typedData.user_id;

  const { users, order_items, ...orderData } = typedData;

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
      // Insert the pack item
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
  
      if (packError) throw packError;
  
      // Combine regular items + selected optional (if any)
      const itemsToInsert = [
        ...packItem.pack_items,
        ...(packItem.selected_optional_item ? [packItem.selected_optional_item] : [])
      ];
  
      // Insert all items (regular + selected optional treated the same)
      if (itemsToInsert.length > 0) {
        const { error } = await supabaseServer
          .from('order_items')
          .insert(itemsToInsert.map(item => ({
            order_id: newOrder.id,
            parent_pack_id: insertedPack.id,
            item_code: item.item_code,
            quantity: item.quantity,
            price: item.price || 0,
            size: item.size || null,
            color: item.color || null,
            color_hex: item.color_hex || null,
            name: item.name || null,
            image: item.image || null,
            pre_price: item.pre_price || 0,
            discount_perc: item.discount_perc || 0,
            is_pack: false,
            pack_code: null,
            // No is_optional field needed
          })));
  
        if (error) throw error;
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

/**
 * Fetch aggregated item quantities from the database
 */
// lib/store/orders/db.ts
export async function getItemQuantities(): Promise<{
  items: ItemWithQuantity[];
  packs: PackWithQuantity[];
}> {
  try {
    const [activeItems, activePacks, orderedItems] = await Promise.all([
      getActiveStoreItems(),
      getActiveStorePacks(),
      supabaseServer
        .from('order_items')
        .select('item_code, quantity, name, is_pack, size, color, color_hex')
        .order('item_code'),
    ]);

    if (orderedItems.error) throw orderedItems.error;

    // Create maps for ordered quantities
    const itemQuantityMap = new Map<string, number>();
    const packQuantityMap = new Map<string, number>();
    const itemNameMap = new Map<string, string>();
    const packNameMap = new Map<string, string>();
    const itemVariationsMap = new Map<string, ItemSizeColorQuantity[]>();

    orderedItems.data?.forEach((item) => {
      if (item.is_pack) {
        packQuantityMap.set(
          item.item_code,
          (packQuantityMap.get(item.item_code) || 0) + item.quantity
        );
        packNameMap.set(item.item_code, item.name);
      } else {
        itemQuantityMap.set(
          item.item_code,
          (itemQuantityMap.get(item.item_code) || 0) + item.quantity
        );
        itemNameMap.set(item.item_code, item.name);
        
        // Track variations
        if (item.size || item.color) {
          const variations = itemVariationsMap.get(item.item_code) || [];
          const existingVariation = variations.find(v => 
            v.size === item.size && v.color === item.color
          );
          
          if (existingVariation) {
            existingVariation.quantity += item.quantity;
          } else {
            variations.push({
              size: item.size || undefined,
              color: item.color || undefined,
              color_hex: item.color_hex || undefined,
              quantity: item.quantity
            });
          }
          itemVariationsMap.set(item.item_code, variations);
        }
      }
    });

    // Combine with active items
    const itemsWithQuantities: ItemWithQuantity[] = activeItems.map((item) => {
      const baseItem: ItemWithQuantity = {
        item_code: item.item_code,
        name: item.name,
        quantity: itemQuantityMap.get(item.item_code) || 0,
        active: item.active,
      };

      // Add variations if they exist
      const variations = itemVariationsMap.get(item.item_code);
      if (variations && variations.length > 0) {
        return {
          ...baseItem,
          variations: variations
        };
      }
      return baseItem;
    });

    // Combine with active packs (unchanged)
    const packsWithQuantities: PackWithQuantity[] = activePacks.map((pack) => ({
      pack_code: pack.pack_code,
      name: pack.name,
      quantity: packQuantityMap.get(pack.pack_code) || 0,
      active: pack.active,
    }));

    return {
      items: itemsWithQuantities,
      packs: packsWithQuantities,
    };
  } catch (error) {
    console.error('Error fetching item quantities:', error);
    throw error;
  }
}

/**
 * Search and filter item quantities
 */
export async function searchItemQuantities(
  params: ItemQuantitySearchParams
): Promise<{
  items: ItemWithQuantity[];
  packs: PackWithQuantity[];
}> {
  try {
    const { items, packs } = await getItemQuantities();
    
    // Filter by search input
    let filteredItems = [...items];
    let filteredPacks = [...packs];
    
    if (params.search?.trim()) {
      const term = params.search.toLowerCase();
      filteredItems = filteredItems.filter((item) => 
        item.item_code.toLowerCase().includes(term) || 
        item.name.toLowerCase().includes(term)
      );
      filteredPacks = filteredPacks.filter((pack) => 
        pack.pack_code.toLowerCase().includes(term) || 
        pack.name.toLowerCase().includes(term)
      );
    }
    
    return {
      items: filteredItems,
      packs: filteredPacks,
    };
  } catch (error) {
    console.error('Error searching item quantities:', error);
    throw error;
  }
}
