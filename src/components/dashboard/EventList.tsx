import React from 'react';
import { Edit, Eye, EyeOff, ExternalLink, Copy } from 'lucide-react';
import { Event } from '../../types';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { updateEvent } from '../../utils/storage';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onSelect: (event: Event) => void;
  onUpdate: () => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onEdit,
  onSelect,
  onUpdate,
}) => {
  const handleToggleActive = (event: Event) => {
    const updatedEvent = { ...event, isActive: !event.isActive };
    updateEvent(updatedEvent);
    onUpdate();
  };
  
  const copyEventLink = (eventId: string) => {
    const link = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(link);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = 'Link copiado!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Local
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/60 divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={event.imageUrl}
                        alt={event.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(event.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.isActive ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyEventLink(event.id)}
                      title="Copiar link do evento"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/event/${event.id}`, '_blank')}
                      title="Ver evento"
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(event)}
                      title={event.isActive ? 'Desativar evento' : 'Ativar evento'}
                    >
                      {event.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(event)}
                      title="Editar evento"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;