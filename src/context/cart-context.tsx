'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CartItem, CartPackItem } from '@/lib/store/types';

interface CartContextType {
  cartItems: (CartItem | CartPackItem)[];
  addToCart: (item: CartItem | CartPackItem) => void;
  removeFromCart: (itemId: string, size?: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemKey: (id: string, size?: string, color?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to check if an item is a pack
function isPackItem(item: CartItem | CartPackItem): item is CartPackItem {
  return 'pack_items' in item && Array.isArray((item as CartPackItem).pack_items);
}

// Generate a unique key for cart items based on id, size, and color
const getItemKey = (id: string, size?: string, color?: string): string => {
  return `${id}_${size || 'no-size'}_${color || 'no-color'}`;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<(CartItem | CartPackItem)[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as (CartItem | CartPackItem)[];
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Update localStorage and calculate totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Calculate total items and subtotal
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setTotalItems(total);
    setSubtotal(cartSubtotal);
  }, [cartItems]);

  // Check if two pack items are the same (including their customizations)
  const areSamePackItems = (item1: CartPackItem, item2: CartPackItem): boolean => {
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

  // Add an item to the cart
  const addToCart = (newItem: CartItem | CartPackItem): void => {
    if (isPackItem(newItem)) {
      // It's a pack item
      setCartItems((prevItems) => {
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
      });
    } else {
      // It's a regular item
      if (!newItem.item_code) {
        console.error('Cannot add item to cart: item_code is required');
        return;
      }

      setCartItems((prevItems) => {
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
      });
    }
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string, size?: string, color?: string): void => {
    // Check if it's a pack item by ID format
    const packIndexMatch = itemId.match(/^pack_item_(\d+)$/);

    if (packIndexMatch) {
      // It's a pack item reference by index
      const index = parseInt(packIndexMatch[1], 10);

      setCartItems((prevItems) => {
        if (index >= 0 && index < prevItems.length) {
          // Remove the pack at the specific index
          return [...prevItems.slice(0, index), ...prevItems.slice(index + 1)];
        }
        return prevItems;
      });
    } else {
      // Regular item or direct pack ID
      setCartItems((prevItems) =>
        prevItems.filter((item) => {
          if (isPackItem(item)) {
            // Remove pack by direct ID reference
            return item.id !== itemId;
          }
          // Remove regular item by composite key
          return getItemKey(item.id, item.size, item.color) !== getItemKey(itemId, size, color);
        })
      );
    }
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (
    itemId: string,
    quantity: number,
    size?: string,
    color?: string
  ): void => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }

    // Check if it's a pack item by ID format
    const packIndexMatch = itemId.match(/^pack_item_(\d+)$/);

    if (packIndexMatch) {
      // It's a pack item reference by index
      const index = parseInt(packIndexMatch[1], 10);

      setCartItems((prevItems) => {
        if (index >= 0 && index < prevItems.length) {
          // Update the quantity of the pack at the specific index
          const updatedItems = [...prevItems];
          updatedItems[index] = { ...updatedItems[index], quantity };
          return updatedItems;
        }
        return prevItems;
      });
    } else {
      // Regular item or direct pack ID
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (isPackItem(item)) {
            // Update pack by direct ID reference
            return item.id === itemId ? { ...item, quantity } : item;
          }
          // Update regular item by composite key
          return getItemKey(item.id, item.size, item.color) === getItemKey(itemId, size, color)
            ? { ...item, quantity }
            : item;
        })
      );
    }
  };

  // Clear the entire cart
  const clearCart = (): void => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Cart drawer controls
  const openCart = (): void => setIsCartOpen(true);
  const closeCart = (): void => setIsCartOpen(false);
  const toggleCart = (): void => setIsCartOpen((prev) => !prev);

  // Context value
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    getItemKey,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for using the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Export the helper function for use in other components
export { isPackItem };
