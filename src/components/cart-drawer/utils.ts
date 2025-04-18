import { CartPackItem, CartPackItemDetail, StorePack } from '@/lib/store/types';

export function isPackCartItem(item: any): boolean {
  return item && 'pack_items' in item && Array.isArray(item.pack_items);
}

/**
 * Format currency for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Check if two cart pack items have the same selections
 * Used to determine if a new item should be added or an existing one updated
 */
export function areSameCartPackItems(item1: CartPackItem, item2: CartPackItem): boolean {
  // Different pack IDs means different items
  if (item1.pack_id !== item2.pack_id) {
    return false;
  }

  // Different number of pack items means different configurations
  if (item1.pack_items.length !== item2.pack_items.length) {
    return false;
  }

  // Compare each pack item
  for (let i = 0; i < item1.pack_items.length; i++) {
    const detail1 = item1.pack_items[i];

    // Find the matching item in the second pack
    const detail2 = item2.pack_items.find((d) => d.item_id === detail1.item_id);

    // If no matching item or different selections, items are different
    if (!detail2 || detail1.size !== detail2.size || detail1.color !== detail2.color) {
      return false;
    }
  }

  // All items match
  return true;
}

/**
 * Create a cart pack item from a store pack, with default selections
 */
export function createCartPackItem(pack: StorePack, quantity = 1): CartPackItem {
  // Make sure the pack has items
  if (!pack.pack_items || pack.pack_items.length === 0) {
    throw new Error('Pack has no items');
  }

  // Create the initial cart pack item with a unique ID
  // Format: pack_[packId]_[timestamp]
  const uniqueId = `pack_${pack.id}_${Date.now()}`;

  const cartPackItem: CartPackItem = {
    id: uniqueId,
    pack_id: pack.id,
    pack_code: pack.pack_code,
    name: pack.name,
    price: pack.price,
    quantity,
    image: pack.images && pack.images.length > 0 ? pack.images[0] : undefined,
    pack_items: [],
  };

  // Add details for each pack item with default selections
  for (const packItem of pack.pack_items) {
    const item = packItem.item;

    if (!item) {
      continue; // Skip if item data is missing
    }

    // For each item in the pack, create an entry with default selections
    const cartPackItemDetail: CartPackItemDetail = {
      item_id: item.id,
      item_code: item.item_code,
      name: item.name,
      quantity: packItem.quantity,
      image: item.images && item.images.length > 0 ? item.images[0] : undefined,
    };

    // Add default size if available
    if (item.sizes && item.sizes.length > 0) {
      cartPackItemDetail.size = item.sizes[0];
    }

    // Add default color if available
    if (item.colors && item.colors.length > 0) {
      cartPackItemDetail.color = item.colors[0].name;
      cartPackItemDetail.colorHex = item.colors[0].hex;
    }

    cartPackItem.pack_items.push(cartPackItemDetail);
  }

  return cartPackItem;
}

/**
 * Update a pack item detail in a cart pack item
 */
export function updateCartPackItemDetail(
  cartPackItem: CartPackItem,
  itemIndex: number,
  updates: Partial<CartPackItemDetail>
): CartPackItem {
  // Make a deep copy of the cart pack item
  const updatedCartPackItem = {
    ...cartPackItem,
    pack_items: [...cartPackItem.pack_items],
  };

  // Validate the item index
  if (itemIndex < 0 || itemIndex >= updatedCartPackItem.pack_items.length) {
    throw new Error('Invalid item index');
  }

  // Update the specified item
  updatedCartPackItem.pack_items[itemIndex] = {
    ...updatedCartPackItem.pack_items[itemIndex],
    ...updates,
  };

  return updatedCartPackItem;
}
