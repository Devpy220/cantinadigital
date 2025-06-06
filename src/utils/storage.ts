import { MenuItem, CartItem, User, Order, Event } from '../types';
import { generateId } from './formatters';

// Helper function to initialize local storage
export const initializeStorage = (): void => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('menuItems')) {
    localStorage.setItem('menuItems', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const register = (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return null;
  }
  
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.setItem('currentUser', JSON.stringify(null));
};

// Event operations
export const getEvents = (): Event[] => {
  const events = localStorage.getItem('events');
  return events ? JSON.parse(events) : [];
};

export const getEventById = (id: string): Event | null => {
  const events = getEvents();
  return events.find(event => event.id === id) || null;
};

export const getUserEvents = (userId: string): Event[] => {
  const events = getEvents();
  return events.filter(event => event.organizerId === userId);
};

export const addEvent = (event: Event): void => {
  const events = getEvents();
  events.push(event);
  localStorage.setItem('events', JSON.stringify(events));
};

export const updateEvent = (updatedEvent: Event): void => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
    localStorage.setItem('events', JSON.stringify(events));
  }
};

export const deleteEvent = (id: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  localStorage.setItem('events', JSON.stringify(filteredEvents));
  
  // Also delete all menu items for this event
  const menuItems = getMenuItems();
  const filteredMenuItems = menuItems.filter(item => item.eventId !== id);
  localStorage.setItem('menuItems', JSON.stringify(filteredMenuItems));
};

// Menu Items operations
export const getMenuItems = (): MenuItem[] => {
  const items = localStorage.getItem('menuItems');
  return items ? JSON.parse(items) : [];
};

export const getMenuItemsByEvent = (eventId: string): MenuItem[] => {
  const items = getMenuItems();
  return items.filter(item => item.eventId === eventId);
};

export const addMenuItem = (item: MenuItem): void => {
  const items = getMenuItems();
  items.push(item);
  localStorage.setItem('menuItems', JSON.stringify(items));
};

export const updateMenuItem = (updatedItem: MenuItem): void => {
  const items = getMenuItems();
  const index = items.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem('menuItems', JSON.stringify(items));
  }
};

export const deleteMenuItem = (id: string): void => {
  const items = getMenuItems();
  const filteredItems = items.filter(item => item.id !== id);
  localStorage.setItem('menuItems', JSON.stringify(filteredItems));
};

// Orders
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const getOrdersByEvent = (eventId: string): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.eventId === eventId);
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};