import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';
import Button from '../components/common/Button';

const OrderSuccessPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Pedido Enviado | EventHub';
    return () => {
      document.title = 'EventHub';
    };
  }, []);
  
  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8">
        <CheckCircle
          size={64}
          className="mx-auto text-green-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pedido Enviado!
        </h2>
        <p className="text-gray-600 mb-4">
          Seu pedido foi enviado via WhatsApp para o organizador do evento.
        </p>
        <p className="text-gray-600 mb-6">
          Em breve você receberá a confirmação e instruções para retirada.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-center mb-2">
            <MessageCircle className="text-blue-600 mr-2" size={20} />
            <span className="text-blue-800 font-medium">WhatsApp Enviado</span>
          </div>
          <p className="text-blue-700 text-sm">
            Verifique seu WhatsApp para acompanhar o status do pedido
          </p>
        </div>
        
        <Link to="/">
          <Button variant="primary" fullWidth>
            Voltar aos Eventos
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;