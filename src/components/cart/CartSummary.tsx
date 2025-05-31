import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Button from '../common/Button';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { redirectToCheckout } from '../../utils/stripe';

const CartSummary: React.FC = () => {
  const { cartItems, totalItems, totalAmount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      await redirectToCheckout(cartItems);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600">Itens:</span>
        <span className="font-medium">{totalItems}</span>
      </div>
      
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-medium">{formatCurrency(totalAmount)}</span>
      </div>
      
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <span className="text-gray-600">Total:</span>
        <span className="font-bold text-xl text-orange-600">
          {formatCurrency(totalAmount)}
        </span>
      </div>
      
      <Button
        variant="primary"
        fullWidth
        className="mt-6"
        onClick={handleCheckout}
        disabled={totalItems === 0 || isLoading}
      >
        <ShoppingBag className="mr-2" size={18} />
        {isLoading ? 'Processando...' : 'Finalizar Pedido'}
      </Button>
      
      {totalItems === 0 && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Adicione itens ao carrinho para continuar
        </p>
      )}
    </div>
  );
};

export default CartSummary;