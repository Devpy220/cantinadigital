import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Calendar, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Event, MenuItem, Order } from '../types';
import { getUserEvents, getMenuItemsByEvent, getOrdersByEvent } from '../utils/storage';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import EventForm from '../components/dashboard/EventForm';
import EventList from '../components/dashboard/EventList';
import ProductManagement from '../components/dashboard/ProductManagement';
import OrderManagement from '../components/dashboard/OrderManagement';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'products' | 'orders'>('events');
  
  useEffect(() => {
    document.title = 'Dashboard | EventHub';
    return () => {
      document.title = 'EventHub';
    };
  }, []);
  
  useEffect(() => {
    if (user) {
      loadUserEvents();
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedEvent) {
      loadEventData();
    }
  }, [selectedEvent]);
  
  const loadUserEvents = () => {
    if (user) {
      const userEvents = getUserEvents(user.id);
      setEvents(userEvents);
      if (userEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(userEvents[0]);
      }
    }
  };
  
  const loadEventData = () => {
    if (selectedEvent) {
      const items = getMenuItemsByEvent(selectedEvent.id);
      const eventOrders = getOrdersByEvent(selectedEvent.id);
      setMenuItems(items);
      setOrders(eventOrders);
    }
  };
  
  const handleEventCreated = () => {
    loadUserEvents();
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };
  
  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };
  
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setActiveTab('events');
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.isActive).length,
    totalProducts: selectedEvent ? menuItems.length : 0,
    totalOrders: selectedEvent ? orders.length : 0,
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Gerencie seus eventos e produtos</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEventModalOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Novo Evento
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <Calendar className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Total de Eventos</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <Calendar className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Eventos Ativos</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <Package className="text-orange-600 mr-3" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Produtos</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <ShoppingBag className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Pedidos</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Nenhum evento criado
            </h2>
            <p className="text-gray-500 mb-6">
              Crie seu primeiro evento para começar a vender produtos
            </p>
            <Button
              variant="primary"
              onClick={() => setIsEventModalOpen(true)}
            >
              <Plus size={18} className="mr-2" />
              Criar Primeiro Evento
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Event Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Selecionar Evento:
            </label>
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => {
                const event = events.find(ev => ev.id === e.target.value);
                if (event) setSelectedEvent(event);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} {event.isActive ? '(Ativo)' : '(Inativo)'}
                </option>
              ))}
            </select>
          </div>
          
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Eventos
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pedidos
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'events' && (
            <EventList
              events={events}
              onEdit={handleEventEdit}
              onSelect={handleEventSelect}
              onUpdate={loadUserEvents}
            />
          )}
          
          {activeTab === 'products' && selectedEvent && (
            <ProductManagement
              event={selectedEvent}
              items={menuItems}
              onUpdate={loadEventData}
            />
          )}
          
          {activeTab === 'orders' && selectedEvent && (
            <OrderManagement
              event={selectedEvent}
              orders={orders}
              onUpdate={loadEventData}
            />
          )}
        </div>
      )}
      
      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Editar Evento' : 'Novo Evento'}
        size="lg"
      >
        <EventForm
          event={editingEvent}
          onSubmit={handleEventCreated}
          onCancel={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;