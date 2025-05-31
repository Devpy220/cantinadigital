// Type definitions for the application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  password: string; // Note: In a real app, we would not store plain text passwords
  isAdmin: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'completed';
  paymentMethod: 'pix' | 'credit' | 'debit';
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit';

export type Category = 'food' | 'drinks' | 'snacks' | 'desserts' | 'all';