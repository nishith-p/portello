import { CartPackItem, CartPackItemDetail, StorePack } from '@/lib/store/types';

/**
 * Create a cart pack item from a store pack, with default selections
 */
export function createCartPackItem(pack: StorePack, quantity = 1): CartPackItem {
  if (!pack.pack_items || pack.pack_items.length === 0) {
    throw new Error('Pack has no items');
  }

  const uniqueId = `pack_${pack.id}_${Date.now()}`;

  const cartPackItem: CartPackItem = {
    id: uniqueId,
    pack_id: pack.id,
    pack_code: pack.pack_code,
    name: pack.name,
    price: pack.price,
    pre_price: pack.pre_price ?? 0,
    discount_perc: pack.discount_perc ?? 0,
    quantity,
    image: pack.images && pack.images.length > 0 ? pack.images[0] : undefined,
    pack_items: [],
  };

  for (const packItem of pack.pack_items) {
    const item = packItem.item;

    if (!item) {
      continue;
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
  const updatedCartPackItem = {
    ...cartPackItem,
    pack_items: [...cartPackItem.pack_items],
  };

  if (itemIndex < 0 || itemIndex >= updatedCartPackItem.pack_items.length) {
    throw new Error('Invalid item index');
  }

  updatedCartPackItem.pack_items[itemIndex] = {
    ...updatedCartPackItem.pack_items[itemIndex],
    ...updates,
  };

  return updatedCartPackItem;
}
