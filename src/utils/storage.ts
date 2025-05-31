// Utilities for local storage

import { MenuItem, CartItem, User, Order } from '../types';

// Initial sample data
const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pastel de Queijo',
    description: 'Delicioso pastel recheado com queijo derretido',
    price: 8.5,
    imageUrl: 'https://images.pexels.com/photos/4553111/pexels-photo-4553111.jpeg',
    category: 'food',
    available: true,
  },
  {
    id: '2',
    name: 'Caldo de Mandioca',
    description: 'Caldo quente de mandioca com carne e temperos',
    price: 12.0,
    imageUrl: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    category: 'food',
    available: true,
  },
  {
    id: '3',
    name: 'Refrigerante',
    description: 'Lata de refrigerante gelado',
    price: 5.0,
    imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
    category: 'drinks',
    available: true,
  },
  {
    id: '4',
    name: 'Água',
    description: 'Garrafa de água mineral',
    price: 3.0,
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg',
    category: 'drinks',
    available: true,
  },
  {
    id: '5',
    name: 'Pé de Moleque',
    description: 'Doce tradicional de amendoim',
    price: 4.5,
    imageUrl: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg',
    category: 'desserts',
    available: true,
  },
  {
    id: '6',
    name: 'Cachorro Quente',
    description: 'Cachorro quente completo com molhos',
    price: 10.0,
    imageUrl: 'https://images.pexels.com/photos/3023479/pexels-photo-3023479.jpeg',
    category: 'food',
    available: true,
  },
];

const sampleUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    isAdmin: true,
  },
];

// Helper function to initialize local storage with sample data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify(sampleMenuItems));
  }
  
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }
};

// Menu Items CRUD
export const getMenuItems = (): MenuItem[] => {
  const items = localStorage.getItem('menuItems');
  return items ? JSON.parse(items) : [];
};

export const addMenuItem = (item: MenuItem): void => {
  const items = getMenuItems();
  items.push(item);
  localStorage.setItem('menuItems', JSON.stringify(items));
};

export const updateMenuItem = (updatedItem: MenuItem): void => {
  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem('menuItems', JSON.stringify(items));
  }
};

export const deleteMenuItem = (id: string): void => {
  const items = getMenuItems();
  const filteredItems = items.filter((item) => item.id !== id);
  localStorage.setItem('menuItems', JSON.stringify(filteredItems));
};

// Cart operations
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: MenuItem, quantity: number): void => {
  const cart = getCart();
  const existingItem = cart.find((cartItem) => cartItem.item.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ item, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  const cart = getCart();
  const index = cart.findIndex((cartItem) => cartItem.item.id === itemId);
  
  if (index !== -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const removeFromCart = (itemId: string): void => {
  const cart = getCart();
  const filteredCart = cart.filter((cartItem) => cartItem.item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(filteredCart));
};

export const clearCart = (): void => {
  localStorage.setItem('cart', JSON.stringify([]));
};

// User authentication
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const login = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.setItem('currentUser', JSON.stringify(null));
};

// Orders
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const index = orders.findIndex((order) => order.id === orderId);
  
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};