import { CartPackItem, CartPackItemDetail, StorePack, StorePackItem } from '@/lib/store/types';

/**
 * Create a cart pack item from a store pack, with default selections
 */
export function createCartPackItem(pack: StorePack, quantity = 1): CartPackItem {
  if (!pack.pack_items || pack.pack_items.length === 0) {
    throw new Error('Pack has no items');
  }

  const uniqueId = `pack_${pack.id}_${Date.now()}`;

  // Separate regular and optional items
  const regularItems = pack.pack_items.filter(item => !item.is_optional);
  const optionalItems = pack.pack_items.filter(item => item.is_optional);

  const cartPackItem: CartPackItem = {
    id: uniqueId,
    pack_id: pack.id,
    pack_code: pack.pack_code,
    name: pack.name,
    price: pack.price,
    pre_price: pack.pre_price ?? 0,
    discount_perc: pack.discount_perc ?? 0,
    quantity,
    image: pack.images?.[0],
    pack_items: [],
    optional_items: [], // Initialize as empty array
    selected_optional_item: null // Initialize as null
  };

  // Process regular items
  for (const packItem of regularItems) {
    const item = packItem.item;
    if (!item) continue;

    const cartPackItemDetail = createPackItemDetail(packItem, item);
    cartPackItem.pack_items.push(cartPackItemDetail);
  }

  // Process optional items
  for (const packItem of optionalItems) {
    const item = packItem.item;
    if (!item) continue;

    const cartPackItemDetail = createPackItemDetail(packItem, item);
    cartPackItem.optional_items!.push(cartPackItemDetail); // Use non-null assertion since we initialized it
  }

  return cartPackItem;
}

/**
 * Helper function to create pack item details
 */
function createPackItemDetail(packItem: StorePackItem, item: NonNullable<StorePackItem['item']>): CartPackItemDetail {
  const detail: CartPackItemDetail = {
    item_id: item.id,
    item_code: item.item_code,
    name: item.name,
    quantity: packItem.quantity,
    image: item.images && item.images.length > 0 ? item.images[0] : undefined,
    is_optional: packItem.is_optional || false
  };

  // Add default size if available
  if (item.sizes && item.sizes.length > 0) {
    detail.size = item.sizes[0];
  }

  // Add default color if available
  if (item.colors && item.colors.length > 0) {
    detail.color = item.colors[0].name;
    detail.colorHex = item.colors[0].hex;
  }

  return detail;
}

/**
 * Update a pack item detail in a cart pack item
 */
export function updateCartPackItemDetail(
  cartPackItem: CartPackItem,
  itemIndex: number,
  updates: Partial<CartPackItemDetail>
): CartPackItem {
  // Create copies of the arrays to avoid mutating the original
  const updatedPackItems = [...cartPackItem.pack_items];
  const updatedOptionalItems = [...(cartPackItem.optional_items || [])];

  if (itemIndex < updatedPackItems.length) {
    // Update regular item
    updatedPackItems[itemIndex] = {
      ...updatedPackItems[itemIndex],
      ...updates,
    };
  } else if (itemIndex - updatedPackItems.length < updatedOptionalItems.length) {
    // Update optional item
    const optionalIndex = itemIndex - updatedPackItems.length;
    updatedOptionalItems[optionalIndex] = {
      ...updatedOptionalItems[optionalIndex],
      ...updates,
    };
  } else {
    throw new Error('Invalid item index');
  }

  return {
    ...cartPackItem,
    pack_items: updatedPackItems,
    optional_items: updatedOptionalItems,
  };
}

/**
 * Select an optional item for the pack
 */
export function selectOptionalItem(
  cartPackItem: CartPackItem,
  optionalItemIndex: number
): CartPackItem {
  if (!cartPackItem.optional_items || optionalItemIndex < 0 || optionalItemIndex >= cartPackItem.optional_items.length) {
    throw new Error('Invalid optional item index');
  }

  return {
    ...cartPackItem,
    selected_optional_item: {
      ...cartPackItem.optional_items[optionalItemIndex],
    },
  };
}

/**
 * Remove the selected optional item from the pack
 */
export function removeSelectedOptionalItem(
  cartPackItem: CartPackItem
): CartPackItem {
  return {
    ...cartPackItem,
    selected_optional_item: null,
  };
}