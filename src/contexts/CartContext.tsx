import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem } from '../types';

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
  
  const addToCart = (item: MenuItem, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prev, { item, quantity }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  };
  
  const clearCart = () => {
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