import { BadRequestError, NotFoundError, ValidationError } from '@/lib/core/errors';
import { supabaseServer } from '@/lib/core/supabase';
import { getStoreItemById } from '@/lib/store/items/db';
import {
  StorePack,
  StorePackInput,
  StorePackItemInput,
  StorePackSearchParams,
  StorePackWithItemsInput,
} from '@/lib/store/types';

/**
 * Get a store pack by ID with its items
 */
export async function getStorePackById(id: string): Promise<StorePack | null> {
  // First get the pack
  const { data: pack, error } = await supabaseServer
    .from('store_packs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No pack found is not an error
    }
    throw error;
  }

  if (!pack) {
    return null;
  }

  // Then get the pack items
  const { data: packItems, error: itemsError } = await supabaseServer
    .from('store_pack_items')
    .select(
      `
      *,
      item:item_id(*)
    `
    )
    .eq('pack_id', id);

  if (itemsError) {
    throw itemsError;
  }

  return {
    ...pack,
    pack_items: packItems || [],
  };
}

/**
 * Get a store pack by pack code
 */
export async function getStorePackByCode(packCode: string): Promise<StorePack | null> {
  const { data, error } = await supabaseServer
    .from('store_packs')
    .select('*')
    .eq('pack_code', packCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No pack found is not an error
    }
    throw error;
  }

  if (!data) {
    return null;
  }

  // Then get the pack items
  const { data: packItems, error: itemsError } = await supabaseServer
    .from('store_pack_items')
    .select(
      `
      *,
      item:item_id(*)
    `
    )
    .eq('pack_id', data.id);

  if (itemsError) {
    throw itemsError;
  }

  return {
    ...data,
    pack_items: packItems || [],
  };
}

/**
 * Get all active store packs (for public store view)
 */
export async function getActiveStorePacks(): Promise<StorePack[]> {
  const { data, error } = await supabaseServer
    .from('store_packs')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get all pack items for all packs in a single query for efficiency
  const packIds = data.map((pack) => pack.id);

  const { data: allPackItems, error: itemsError } = await supabaseServer
    .from('store_pack_items')
    .select(
      `
      *,
      item:item_id(*)
    `
    )
    .in('pack_id', packIds);

  if (itemsError) {
    throw itemsError;
  }

  // Group pack items by pack_id
  const packItemsByPackId: Record<string, any[]> = {};
  if (allPackItems) {
    for (const item of allPackItems) {
      if (!packItemsByPackId[item.pack_id]) {
        packItemsByPackId[item.pack_id] = [];
      }
      packItemsByPackId[item.pack_id].push(item);
    }
  }

  // Combine packs with their items
  return data.map((pack) => ({
    ...pack,
    pack_items: packItemsByPackId[pack.id] || [],
  }));
}

/**
 * Search and filter store packs (for admin panel)
 */
export async function searchStorePacks(
  params: StorePackSearchParams
): Promise<{ packs: StorePack[]; total: number }> {
  const { search = '', active, limit = 10, offset = 0 } = params;

  // Start building the query
  let query = supabaseServer.from('store_packs').select('*', {
    count: 'exact',
  });

  // Add filters if provided
  if (search) {
    query = query.or(
      `pack_code.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`
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

  if (!data || data.length === 0) {
    return {
      packs: [],
      total: count || 0,
    };
  }

  // Get all pack items for all packs in a single query for efficiency
  const packIds = data.map((pack) => pack.id);

  const { data: allPackItems, error: itemsError } = await supabaseServer
    .from('store_pack_items')
    .select(
      `
      *,
      item:item_id(*)
    `
    )
    .in('pack_id', packIds);

  if (itemsError) {
    throw itemsError;
  }

  // Group pack items by pack_id
  const packItemsByPackId: Record<string, any[]> = {};
  if (allPackItems) {
    for (const item of allPackItems) {
      if (!packItemsByPackId[item.pack_id]) {
        packItemsByPackId[item.pack_id] = [];
      }
      packItemsByPackId[item.pack_id].push(item);
    }
  }

  // Combine packs with their items
  const packs = data.map((pack) => ({
    ...pack,
    pack_items: packItemsByPackId[pack.id] || [],
  }));

  return {
    packs,
    total: count || 0,
  };
}

/**
 * Create a new store pack with items
 */
export async function createStorePack(packData: StorePackWithItemsInput): Promise<StorePack> {
  // Validate required fields
  if (
    !packData.pack_code ||
    !packData.name ||
    packData.price === undefined ||
    !packData.description ||
    !packData.pack_items ||
    packData.pack_items.length === 0
  ) {
    const missingFields: Record<string, string> = {};
    if (!packData.pack_code) {
      missingFields.pack_code = 'Pack code is required';
    }
    if (!packData.name) {
      missingFields.name = 'Name is required';
    }
    if (packData.price === undefined) {
      missingFields.price = 'Price is required';
    }
    if (!packData.description) {
      missingFields.description = 'Description is required';
    }
    if (!packData.pack_items || packData.pack_items.length === 0) {
      missingFields.pack_items = 'Pack must contain at least one item';
    }

    throw new ValidationError('Missing required store pack fields', missingFields);
  }

  // Check if pack with the same code already exists
  const existingPack = await getStorePackByCode(packData.pack_code);
  if (existingPack) {
    throw new BadRequestError(`Store pack with code '${packData.pack_code}' already exists`);
  }

  // Set default active status if not provided
  if (packData.active === undefined) {
    packData.active = true;
  }

  // Validate that all referenced items exist and are active
  const packItems = packData.pack_items;
  for (const packItem of packItems) {
    const item = await getStoreItemById(packItem.item_id);
    if (!item) {
      throw new NotFoundError(`Store item with ID ${packItem.item_id} not found`);
    }

    if (!item.active) {
      throw new BadRequestError(
        `Store item ${item.name} (${item.item_code}) is not active and cannot be added to a pack`
      );
    }

    if (packItem.quantity <= 0) {
      throw new ValidationError('Item quantity must be positive', {
        quantity: `Quantity for item ${item.name} must be at least 1`,
      });
    }
  }

  // Start a transaction to insert the pack and its items
  const { pack_items, ...packOnly } = packData;

  // Create the pack first
  const { data: newPack, error: packError } = await supabaseServer
    .from('store_packs')
    .insert([packOnly])
    .select()
    .single();

  if (packError || !newPack) {
    throw packError || new Error('Failed to create store pack');
  }

  // Now insert all pack items
  const packItemsToInsert = packItems.map((item) => ({
    pack_id: newPack.id,
    item_id: item.item_id,
    quantity: item.quantity,
  }));

  const { data: newPackItems, error: itemsError } = await supabaseServer
    .from('store_pack_items')
    .insert(packItemsToInsert).select(`
      *,
      item:item_id(*)
    `);

  if (itemsError) {
    // Attempt to clean up the pack since the items failed
    await supabaseServer.from('store_packs').delete().eq('id', newPack.id);
    throw itemsError;
  }

  // Return the complete pack with items
  return {
    ...newPack,
    pack_items: newPackItems || [],
  };
}

/**
 * Update an existing store pack
 */
export async function updateStorePack(
  id: string,
  packData: Partial<StorePackInput>
): Promise<StorePack> {
  // Check if pack exists
  const existingPack = await getStorePackById(id);
  if (!existingPack) {
    throw new NotFoundError(`Store pack with ID ${id} not found`);
  }

  // If updating pack_code, check for duplicates
  if (packData.pack_code && packData.pack_code !== existingPack.pack_code) {
    const duplicatePack = await getStorePackByCode(packData.pack_code);
    if (duplicatePack) {
      throw new BadRequestError(`Store pack with code '${packData.pack_code}' already exists`);
    }
  }

  const { error } = await supabaseServer
    .from('store_packs')
    .update(packData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Get the updated pack with its items
  return (await getStorePackById(id)) as unknown as Promise<StorePack>;
}

/**
 * Update a store pack's active status
 */
export async function updateStorePackStatus(id: string, active: boolean): Promise<StorePack> {
  // Check if pack exists
  const existingPack = await getStorePackById(id);
  if (!existingPack) {
    throw new NotFoundError(`Store pack with ID ${id} not found`);
  }

  const { error } = await supabaseServer
    .from('store_packs')
    .update({ active })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Get the updated pack with its items
  return (await getStorePackById(id)) as unknown as Promise<StorePack>;
}

/**
 * Update a store pack's items
 */
export async function updateStorePackItems(
  id: string,
  packItems: StorePackItemInput[]
): Promise<StorePack> {
  // Check if pack exists
  const existingPack = await getStorePackById(id);
  if (!existingPack) {
    throw new NotFoundError(`Store pack with ID ${id} not found`);
  }

  // Validate that all referenced items exist and are active
  for (const packItem of packItems) {
    const item = await getStoreItemById(packItem.item_id);
    if (!item) {
      throw new NotFoundError(`Store item with ID ${packItem.item_id} not found`);
    }

    if (!item.active) {
      throw new BadRequestError(
        `Store item ${item.name} (${item.item_code}) is not active and cannot be added to a pack`
      );
    }

    if (packItem.quantity <= 0) {
      throw new ValidationError('Item quantity must be positive', {
        quantity: `Quantity for item ${item.name} must be at least 1`,
      });
    }
  }

  // Delete existing pack items
  const { error: deleteError } = await supabaseServer
    .from('store_pack_items')
    .delete()
    .eq('pack_id', id);

  if (deleteError) {
    throw deleteError;
  }

  // Insert new pack items
  const packItemsToInsert = packItems.map((item) => ({
    pack_id: id,
    item_id: item.item_id,
    quantity: item.quantity,
  }));

  const { error: insertError } = await supabaseServer
    .from('store_pack_items')
    .insert(packItemsToInsert).select(`
      *,
      item:item_id(*)
    `);

  if (insertError) {
    throw insertError;
  }

  // Get the updated pack with its items
  return (await getStorePackById(id)) as unknown as Promise<StorePack>;
}
