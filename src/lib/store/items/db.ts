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
      return null; // No item found is not an error
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
      return null; // No item found is not an error
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
 * Search and filter store items (for admin panel)
 */
export async function searchStoreItems(
  params: StoreItemSearchParams
): Promise<{ items: StoreItem[]; total: number }> {
  const { search = '', active, limit = 10, offset = 0 } = params;

  // Start building the query
  let query = supabaseServer.from('store_items').select('*', {
    count: 'exact',
  });

  // Add filters if provided
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

  // Execute the query
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
  // Validate required fields
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

  // Check if item with the same code already exists
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
  // Check if item exists
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
  // Check if item exists
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
