import { supabaseServer } from '@/lib/supabase';
import { StoreItem } from '@/types/store';
import { ConflictError, NotFoundError } from '@/lib/api/errors';

/**
 * Get all store items, optionally including inactive ones
 */
export async function getStoreItems(includeInactive = false): Promise<StoreItem[]> {
  let query = supabaseServer
    .from('store_items')
    .select('*');

  // Only return active items unless includeInactive is true
  if (!includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Get a specific store item by its code
 */
export async function getStoreItem(itemCode: string): Promise<StoreItem> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .select('*')
    .eq('item_code', itemCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Item with code ${itemCode} not found`);
    }
    throw error;
  }
  
  return data;
}

/**
 * Create a new store item
 */
export async function createStoreItem(item: StoreItem): Promise<StoreItem> {
  // Check if item with this code already exists
  const { data: existingItem } = await supabaseServer
    .from('store_items')
    .select('item_code')
    .eq('item_code', item.item_code)
    .maybeSingle();
    
  if (existingItem) {
    throw new ConflictError(`Item with code ${item.item_code} already exists`);
  }

  const { data, error } = await supabaseServer
    .from('store_items')
    .insert({
      item_code: item.item_code,
      name: item.name,
      price: item.price,
      images: item.images,
      sizes: item.sizes,
      colors: item.colors,
      description: item.description,
      active: item.active !== undefined ? item.active : true
    })
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
export async function updateStoreItem(itemCode: string, item: Partial<StoreItem>): Promise<StoreItem> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .update({
      name: item.name,
      price: item.price,
      images: item.images,
      sizes: item.sizes,
      colors: item.colors,
      description: item.description,
      active: item.active
    })
    .eq('item_code', itemCode)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Item with code ${itemCode} not found`);
    }
    throw error;
  }
  
  return data;
}

/**
 * Toggle the active status of a store item
 */
export async function toggleItemActive(itemCode: string, active: boolean): Promise<StoreItem> {
  const { data, error } = await supabaseServer
    .from('store_items')
    .update({ active })
    .eq('item_code', itemCode)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Item with code ${itemCode} not found`);
    }
    throw error;
  }
  
  return data;
}

/**
 * Delete a store item
 */
export async function deleteStoreItem(itemCode: string): Promise<{ success: boolean }> {
  // Check if item exists first
  const { data: existingItem } = await supabaseServer
    .from('store_items')
    .select('item_code')
    .eq('item_code', itemCode)
    .maybeSingle();
    
  if (!existingItem) {
    throw new NotFoundError(`Item with code ${itemCode} not found`);
  }

  const { error } = await supabaseServer
    .from('store_items')
    .delete()
    .eq('item_code', itemCode);

  if (error) {
    throw error;
  }
  
  return { success: true };
}