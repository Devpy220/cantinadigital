import React from 'react';
import { MessageCircle, Phone, CheckCircle } from 'lucide-react';
import { Event, Order } from '../../types';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { sendOrderToWhatsApp, sendOrderConfirmationToCustomer } from '../../utils/whatsapp';
import { updateOrderStatus } from '../../utils/storage';

interface OrderManagementProps {
  event: Event;
  orders: Order[];
  onUpdate: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
  event,
  orders,
  onUpdate,
}) => {
  const handleSendToWhatsApp = (order: Order) => {
    sendOrderToWhatsApp(order);
  };
  
  const handleConfirmOrder = (order: Order) => {
    updateOrderStatus(order.id, 'confirmed');
    sendOrderConfirmationToCustomer(order, event.name);
    onUpdate();
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = 'Pedido confirmado!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Pedidos - {event.name}
        </h2>
        <p className="text-gray-600">Gerencie os pedidos do seu evento</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-8">
            <p className="text-gray-500 text-lg">
              Nenhum pedido recebido ainda.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Pedido #{order.id}
                  </h3>
                  <p className="text-gray-600">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Cliente</h4>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerPhone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Itens do Pedido</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.item.name}</span>
                        <span>{formatCurrency(item.item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendToWhatsApp(order)}
                >
                  <MessageCircle size={16} className="mr-1" />
                  Enviar WhatsApp
                </Button>
                
                {order.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConfirmOrder(order)}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Confirmar Pedido
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;