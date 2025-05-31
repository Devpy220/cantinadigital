import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem } from '../types';
import {
  getCart,
  addToCart as addToCartService,
  updateCartItemQuantity,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from '../utils/storage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Load cart from localStorage
    setCartItems(getCart());
  }, []);
  
  const addToCart = (item: MenuItem, quantity: number) => {
    addToCartService(item, quantity);
    setCartItems(getCart());
  };
  
  const removeFromCart = (itemId: string) => {
    removeFromCartService(itemId);
    setCartItems(getCart());
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    updateCartItemQuantity(itemId, quantity);
    setCartItems(getCart());
  };
  
  const clearCart = () => {
    clearCartService();
    setCartItems([]);
  };
  
  const totalItems = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );
  
  const totalAmount = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};