import { ReactNode } from 'react';
import { CartItem, CartPackItem } from '@/lib/store/types';

export interface CartContextType {
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

export interface CartProviderProps {
  children: ReactNode;
}
