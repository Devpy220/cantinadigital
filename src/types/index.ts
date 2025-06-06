// Type definitions for the application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
  eventId: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  organizerId: string;
  organizerName: string;
  organizerPhone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  eventId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  customerName: string;
  customerPhone: string;
  organizerPhone: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit';

export type Category = 'food' | 'drinks' | 'snacks' | 'desserts' | 'all';