import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, ExternalLink } from 'lucide-react';
import { Event } from '../types';
import { getEvents } from '../utils/storage';
import Card from '../components/common/Card';
import { formatDate } from '../utils/formatters';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const allEvents = getEvents().filter(event => event.isActive);
      setEvents(allEvents);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Eventos Disponíveis
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubra eventos incríveis e faça seus pedidos de forma prática e segura
        </p>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Nenhum evento disponível
          </h2>
          <p className="text-gray-500 mb-6">
            Seja o primeiro a criar um evento na nossa plataforma!
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Minha Conta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" padding="none">
              <div
                className="h-48 bg-center bg-cover relative"
                style={{ backgroundImage: `url(${event.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Ativo
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User size={16} className="mr-2" />
                    <span className="text-sm">Por {event.organizerName}</span>
                  </div>
                </div>
                
                <Link
                  to={`/event/${event.id}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Ver Cardápio
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;