import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event, MenuItem } from '../types';
import { getEventById, getMenuItemsByEvent } from '../utils/storage';
import MenuList from '../components/menu/MenuList';
import { formatDate } from '../utils/formatters';

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!eventId) return;
    
    const timer = setTimeout(() => {
      const eventData = getEventById(eventId);
      const items = getMenuItemsByEvent(eventId);
      
      setEvent(eventData);
      setMenuItems(items);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [eventId]);
  
  useEffect(() => {
    if (event) {
      document.title = `${event.name} | EventHub`;
    }
    return () => {
      document.title = 'EventHub';
    };
  }, [event]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!event || !event.isActive) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar aos Eventos</span>
        </Link>
        
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          <div
            className="h-64 bg-center bg-cover relative"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  {event.organizerName}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </div>
      
      <MenuList items={menuItems} eventName={event.name} />
    </div>
  );
};

export default EventPage;