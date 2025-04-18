import { CartItem, CartPackItem } from '@/lib/store/types';

/**
 * Check if an item is a pack item
 */
export function isPackItem(item: CartItem | CartPackItem): item is CartPackItem {
  return 'pack_items' in item && Array.isArray((item as CartPackItem).pack_items);
}

/**
 * Generate a unique key for cart items based on id, size, and color
 */
export const getItemKey = (id: string, size?: string, color?: string): string => {
  return `${id}_${size || 'no-size'}_${color || 'no-color'}`;
};

/**
 * Check if two pack items are the same (including their customizations)
 */
export const areSamePackItems = (item1: CartPackItem, item2: CartPackItem): boolean => {
  if (item1.pack_id !== item2.pack_id) {
    return false;
  }

  // Check if they have the same number of items
  if (item1.pack_items.length !== item2.pack_items.length) {
    return false;
  }

  // Compare each item's customization
  for (const packItem1 of item1.pack_items) {
    const matchingItem = item2.pack_items.find((pi) => pi.item_id === packItem1.item_id);
    if (!matchingItem) {
      return false;
    }

    // Check if customizations match
    if (packItem1.size !== matchingItem.size || packItem1.color !== matchingItem.color) {
      return false;
    }
  }

  return true;
};

/**
 * Calculate totals from cart items
 */
export const calculateCartTotals = (cartItems: (CartItem | CartPackItem)[]) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { totalItems, subtotal };
};
