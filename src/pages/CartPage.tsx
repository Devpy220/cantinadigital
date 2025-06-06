import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatters';
import { addOrder } from '../utils/storage';
import { sendOrderToWhatsApp } from '../utils/whatsapp';
import { generateId } from '../utils/formatters';

const CartPage: React.FC = () => {
  const { cartItems, totalItems, totalAmount, clearCart } = useCart();
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Carrinho | EventHub';
    return () => {
      document.title = 'EventHub';
    };
  }, []);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Nome é obrigatório';
    }
    
    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Telefone é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFinishOrder = async () => {
    if (!validateForm() || cartItems.length === 0) return;
    
    setLoading(true);
    
    try {
      // Get event info from first item (all items should be from same event)
      const firstItem = cartItems[0];
      const eventId = firstItem.item.eventId;
      
      // Get organizer phone from the item's event
      // In a real app, you'd fetch this from the event data
      const organizerPhone = '11999999999'; // This should come from the event data
      
      const order = {
        id: generateId(),
        eventId,
        items: cartItems,
        totalAmount,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
        organizerPhone,
      };
      
      addOrder(order);
      sendOrderToWhatsApp(order);
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/80 backdrop-blur-md rounded-lg p-8 max-w-md mx-auto">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Adicione alguns itens deliciosos do cardápio para continuar
          </p>
          <Link to="/">
            <Button variant="primary">Ver Eventos</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar aos Eventos</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 ml-auto">
          Meu Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Itens do Pedido</h2>
            {cartItems.map((item) => (
              <CartItem key={item.item.id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Finalizar Pedido</h2>
            
            <div className="mb-6">
              <Input
                label="Seu Nome"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) {
                    setErrors(prev => ({ ...prev, customerName: '' }));
                  }
                }}
                placeholder="Digite seu nome completo"
                error={errors.customerName}
              />
              
              <Input
                label="Seu Telefone"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.customerPhone) {
                    setErrors(prev => ({ ...prev, customerPhone: '' }));
                  }
                }}
                placeholder="(11) 99999-9999"
                error={errors.customerPhone}
              />
            </div>
            
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
              <span className="font-bold text-xl text-blue-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            
            <Button
              variant="primary"
              fullWidth
              className="mt-6"
              onClick={handleFinishOrder}
              disabled={totalItems === 0 || loading}
            >
              <ShoppingCart className="mr-2" size={18} />
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
            
            <p className="text-sm text-gray-600 mt-3 text-center">
              Seu pedido será enviado via WhatsApp para o organizador do evento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;