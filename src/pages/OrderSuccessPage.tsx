import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext';

const OrderSuccessPage: React.FC = () => {
  const { clearCart } = useCart();
  
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div className="bg-white rounded-lg shadow-md p-8">
        <CheckCircle
          size={64}
          className="mx-auto text-green-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pagamento Confirmado!
        </h2>
        <p className="text-gray-600 mb-6">
          Seu pedido foi registrado e será preparado em breve.
        </p>
        
        <Link to="/">
          <Button variant="primary" fullWidth>
            Voltar ao Cardápio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;