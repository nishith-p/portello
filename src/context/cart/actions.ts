import { CartItem, CartPackItem } from '@/lib/store/types';
import { areSamePackItems, getItemKey, isPackItem } from './utils';

/**
 * Add an item to the cart
 */
export const addItemToCart = (
  prevItems: (CartItem | CartPackItem)[],
  newItem: CartItem | CartPackItem
): (CartItem | CartPackItem)[] => {
  if (isPackItem(newItem)) {
    // Check if a matching pack item (same selections) already exists
    const existingPackIndex = prevItems.findIndex(
      (item) =>
        isPackItem(item) &&
        // For packs, we need to check if it's the same pack with the same customizations
        areSamePackItems(item as CartPackItem, newItem)
    );

    if (existingPackIndex >= 0) {
      // Increment quantity of existing pack
      const updatedCart = [...prevItems];
      updatedCart[existingPackIndex].quantity += newItem.quantity || 1;
      return updatedCart;
    }
    // Add as new pack item
    return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
  }
  // It's a regular item
  if (!newItem.item_code) {
    console.error('Cannot add item to cart: item_code is required');
    return prevItems;
  }

  // Handle regular items
  const newItemKey = getItemKey(newItem.id, newItem.size, newItem.color);

  // Check if item already exists in cart with the same key
  const existingItemIndex = prevItems.findIndex((item) => {
    if (isPackItem(item)) {
      return false;
    }
    return getItemKey(item.id, item.size, item.color) === newItemKey;
  });

  if (existingItemIndex >= 0) {
    // Increment quantity of existing item
    const updatedCart = [...prevItems];
    updatedCart[existingItemIndex].quantity += newItem.quantity || 1;
    return updatedCart;
  }
  // Add as new item
  return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
};

/**
 * Remove an item from the cart
 */
export const removeItemFromCart = (
  prevItems: (CartItem | CartPackItem)[],
  itemId: string,
  size?: string,
  color?: string
): (CartItem | CartPackItem)[] => {
  // Check if it's a pack item by ID format
  const packIndexMatch = itemId.match(/^pack_item_(\d+)$/);

  if (packIndexMatch) {
    // It's a pack item reference by index
    const index = parseInt(packIndexMatch[1], 10);

    if (index >= 0 && index < prevItems.length) {
      // Remove the pack at the specific index
      return [...prevItems.slice(0, index), ...prevItems.slice(index + 1)];
    }
    return prevItems;
  }
  // Regular item or direct pack ID
  return prevItems.filter((item) => {
    if (isPackItem(item)) {
      // Remove pack by direct ID reference
      return item.id !== itemId;
    }
    // Remove regular item by composite key
    return getItemKey(item.id, item.size, item.color) !== getItemKey(itemId, size, color);
  });
};

/**
 * Update the quantity of an item in the cart
 */
export const updateItemQuantity = (
  prevItems: (CartItem | CartPackItem)[],
  itemId: string,
  quantity: number,
  size?: string,
  color?: string
): (CartItem | CartPackItem)[] => {
  if (quantity <= 0) {
    return removeItemFromCart(prevItems, itemId, size, color);
  }

  // Check if it's a pack item by ID format
  const packIndexMatch = itemId.match(/^pack_item_(\d+)$/);

  if (packIndexMatch) {
    // It's a pack item reference by index
    const index = parseInt(packIndexMatch[1], 10);

    if (index >= 0 && index < prevItems.length) {
      // Update the quantity of the pack at the specific index
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], quantity };
      return updatedItems;
    }
    return prevItems;
  }
  // Regular item or direct pack ID
  return prevItems.map((item) => {
    if (isPackItem(item)) {
      // Update pack by direct ID reference
      return item.id === itemId ? { ...item, quantity } : item;
    }
    // Update regular item by composite key
    return getItemKey(item.id, item.size, item.color) === getItemKey(itemId, size, color)
      ? { ...item, quantity }
      : item;
  });
};
