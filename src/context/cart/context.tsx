'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartContextType, CartProviderProps } from './types';
import { getItemKey, calculateCartTotals } from './utils';
import { addItemToCart, removeItemFromCart, updateItemQuantity } from './actions';
import { CartItem, CartPackItem } from '@/lib/store/types';

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
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
    const { totalItems: total, subtotal: cartSubtotal } = calculateCartTotals(cartItems);

    setTotalItems(total);
    setSubtotal(cartSubtotal);
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (newItem: CartItem | CartPackItem): void => {
    setCartItems((prevItems) => addItemToCart(prevItems, newItem));
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string, size?: string, color?: string): void => {
    setCartItems((prevItems) => removeItemFromCart(prevItems, itemId, size, color));
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (
    itemId: string,
    quantity: number,
    size?: string,
    color?: string
  ): void => {
    setCartItems((prevItems) => updateItemQuantity(prevItems, itemId, quantity, size, color));
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