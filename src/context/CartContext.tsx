'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the CartItem type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  colorHex?: string; // Added to store the color hex code
}

// Define the CartContext type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
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

// Create the context with undefined as initial value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a unique key for cart items based on id, size, and color
const getItemKey = (id: string, size?: string, color?: string): string => {
  return `${id}_${size || 'no-size'}_${color || 'no-color'}`;
};

// CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // If there's an error parsing, clear localStorage
      localStorage.removeItem('cart');
    }
  }, []);

  // Update localStorage and calculate totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Calculate total items and subtotal
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    setTotalItems(total);
    setSubtotal(cartSubtotal);
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (newItem: CartItem): void => {
    setCartItems(prevItems => {
      // Use getItemKey function to find matching items
      const newItemKey = getItemKey(newItem.id, newItem.size, newItem.color);

      // Check if item already exists in cart with the same key
      const existingItemIndex = prevItems.findIndex(item =>
        getItemKey(item.id, item.size, item.color) === newItemKey
      );

      if (existingItemIndex >= 0) {
        // Increment quantity of existing item
        const updatedCart = [...prevItems];
        updatedCart[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedCart;
      }
        // Add as new item
        return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];

    });
  };

  // Remove an item from the cart
  const removeFromCart = (itemId: string, size?: string, color?: string): void => {
    const itemKey = getItemKey(itemId, size, color);
    setCartItems(prevItems =>
      prevItems.filter(item => getItemKey(item.id, item.size, item.color) !== itemKey)
    );
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (itemId: string, quantity: number, size?: string, color?: string): void => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }

    const itemKey = getItemKey(itemId, size, color);
    setCartItems(prevItems => {
      return prevItems.map(item =>
        getItemKey(item.id, item.size, item.color) === itemKey
          ? { ...item, quantity }
          : item
      );
    });
  };

  // Clear the entire cart
  const clearCart = (): void => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Cart drawer controls
  const openCart = (): void => setIsCartOpen(true);
  const closeCart = (): void => setIsCartOpen(false);
  const toggleCart = (): void => setIsCartOpen(prev => !prev);

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
    getItemKey
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};