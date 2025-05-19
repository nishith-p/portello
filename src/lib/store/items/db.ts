import { BadRequestError, NotFoundError, ValidationError } from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';
import { StoreItem, StoreItemInput, StoreItemSearchParams } from '@/lib/store/types';

/**
 * Get a store item by ID
 */
export async function getStoreItemById(id: string): Promise<StoreItem | null> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Get a store item by item code
 */
export async function getStoreItemByCode(itemCode: string): Promise<StoreItem | null> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .select('*')
    .eq('item_code', itemCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Get all active store items (for public store view)
 */
export async function getActiveStoreItems(): Promise<StoreItem[]> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get all store items (for item quantities)
 */
export async function getStoreItems(): Promise<StoreItem[]> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Search and filter store items (for admin panel)
 */
export async function searchStoreItems(
  params: StoreItemSearchParams
): Promise<{ items: StoreItem[]; total: number }> {
  const { search = '', active, limit = 10, offset = 0 } = params;

  let query = supabaseServer.from('store_items').select('*', {
    count: 'exact',
  });

  if (search) {
    query = query.or(
      `item_code.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (active !== undefined) {
    query = query.eq('active', active);
  }

  // Add pagination
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    items: data || [],
    total: count || 0,
  };
}

/**
 * Create store item
 */
export async function createStoreItem(itemData: StoreItemInput): Promise<StoreItem> {
  if (
    !itemData.item_code ||
    !itemData.name ||
    itemData.price === undefined ||
    !itemData.description
  ) {
    const missingFields: Record<string, string> = {};
    if (!itemData.item_code) {
      missingFields.item_code = 'Item code is required';
    }
    if (!itemData.name) {
      missingFields.name = 'Name is required';
    }
    if (itemData.price === undefined) {
      missingFields.price = 'Price is required';
    }
    if (!itemData.description) {
      missingFields.description = 'Description is required';
    }

    throw new ValidationError('Missing required store item fields', missingFields);
  }

  const existingItem = await getStoreItemByCode(itemData.item_code);
  if (existingItem) {
    throw new BadRequestError(`Store item with code '${itemData.item_code}' already exists`);
  }

  // Set default active status if not provided
  if (itemData.active === undefined) {
    itemData.active = true;
  }

  const { data, error } = await supabaseServer
    .from('store_items')
    .insert([itemData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update an existing store item
 */
export async function updateStoreItem(
  id: string,
  itemData: Partial<StoreItemInput>
): Promise<StoreItem> {
  const existingItem = await getStoreItemById(id);
  if (!existingItem) {
    throw new NotFoundError(`Store item with ID ${id} not found`);
  }

  // If updating item_code, check for duplicates
  if (itemData.item_code && itemData.item_code !== existingItem.item_code) {
    const duplicateItem = await getStoreItemByCode(itemData.item_code);
    if (duplicateItem) {
      throw new BadRequestError(`Store item with code '${itemData.item_code}' already exists`);
    }
  }

  const { data, error } = await supabaseServer
    .from('store_items')
    .update(itemData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update a store item's active status
 */
export async function updateStoreItemStatus(id: string, active: boolean): Promise<StoreItem> {
  const existingItem = await getStoreItemById(id);
  if (!existingItem) {
    throw new NotFoundError(`Store item with ID ${id} not found`);
  }

  const { data, error } = await supabaseServer
    .from('store_items')
    .update({ active })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get store item's stock
 */
export async function getStoreItemStock(
  itemCode: string,
  color?: string,
  size?: string
): Promise<number | null> {
  let query = supabaseServer
    .from('merch_stock')
    .select('stock')
    .eq('item_code', itemCode);

  if (color) {
    query = query.eq('color', color);
  }

  if (size) {
    query = query.eq('size', size);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // If no stock records found
  if (!data || data.length === 0) {
    return null;
  }

  // If multiple records found (shouldn't happen with proper filtering), sum them up
  return data.reduce((sum, item) => sum + item.stock, 0);
}

/**
 * Reduce stock quantity for an item with smart variation detection
 * Returns true if stock was reduced, false if item wasn't in stock table (pre-order)
 */
export async function reduceItemStock(
  itemCode: string,
  quantity: number,
  color?: string,
  size?: string
): Promise<boolean> {
  // First, check if this item exists in the stock table at all
  const { data: stockRecords, error: countError } = await supabaseServer
    .from('merch_stock')
    .select('*')
    .eq('item_code', itemCode);

  if (countError) {
    throw countError;
  }

  // If no stock records exist, this is a pre-order item - return false
  if (!stockRecords || stockRecords.length === 0) {
    return false;
  }

  // Determine which filters to use based on the stock records
  let query = supabaseServer
    .from('merch_stock')
    .select('stock')
    .eq('item_code', itemCode);

  // Only filter by color if:
  // 1. Color was provided
  // 2. There are multiple records with this item_code
  // 3. The color exists in the stock records
  if (color && stockRecords.length > 1 && stockRecords.some(r => r.color === color)) {
    query = query.eq('color', color);
  }

  // Only filter by size if:
  // 1. Size was provided
  // 2. There are multiple records with this item_code
  // 3. The size exists in the stock records
  if (size && stockRecords.length > 1 && stockRecords.some(r => r.size === size)) {
    query = query.eq('size', size);
  }

  const { data: stockData, error: selectError } = await query;

  if (selectError) {
    throw selectError;
  }

  if (!stockData || stockData.length === 0) {
    throw new Error(`No matching stock record found for item ${itemCode}`);
  }

  const currentStock = stockData[0].stock;
  if (currentStock < quantity) {
    throw new Error(`Insufficient stock for item ${itemCode}. Available: ${currentStock}, Requested: ${quantity}`);
  }

  // Prepare update query with the same filters
  let updateQuery = supabaseServer
    .from('merch_stock')
    .update({ stock: currentStock - quantity })
    .eq('item_code', itemCode);

  if (color && stockRecords.length > 1 && stockRecords.some(r => r.color === color)) {
    updateQuery = updateQuery.eq('color', color);
  }

  if (size && stockRecords.length > 1 && stockRecords.some(r => r.size === size)) {
    updateQuery = updateQuery.eq('size', size);
  }

  const { error: updateError } = await updateQuery;

  if (updateError) {
    throw updateError;
  }

  return true; // Stock was successfully reduced
}

/**
 * Reduce stock for all items in a pack
 */
export async function reducePackItemStock(
  packItems: {
    item_code: string;
    quantity: number;
    color?: string;
    size?: string;
  }[]
): Promise<void> {
  // First verify all items have sufficient stock
  for (const item of packItems) {
    const stock = await getStoreItemStock(
      item.item_code,
      item.color,
      item.size
    );

    if (stock === null) {
      throw new Error(`No stock record found for item ${item.item_code}`);
    }

    if (stock < item.quantity) {
      throw new Error(
        `Insufficient stock for item ${item.item_code}. Available: ${stock}, Requested: ${item.quantity}`
      );
    }
  }

  // If all items have sufficient stock, proceed to reduce
  for (const item of packItems) {
    await reduceItemStock(
      item.item_code,
      item.quantity,
      item.color,
      item.size
    );
  }
}
