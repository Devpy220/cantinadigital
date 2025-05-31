import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentForm from '../components/checkout/PaymentForm';
import { useCart } from '../contexts/CartContext';
import { addOrder } from '../utils/storage';
import { generatePixString } from '../utils/pix';
import { PaymentMethod } from '../types';
import { generateId } from '../utils/formatters';
import Button from '../components/common/Button';

const CheckoutPage: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [pixCode, setPixCode] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Checkout | Cantina Digital';
    return () => {
      document.title = 'Cantina Digital';
    };
  }, []);
  
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [cartItems, navigate, orderComplete]);
  
  const handlePayment = (
    paymentMethod: PaymentMethod,
    customerData: { name: string; phone: string }
  ) => {
    const newOrderId = generateId();
    
    const order = {
      id: newOrderId,
      items: cartItems,
      totalAmount,
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
      customerName: customerData.name,
      customerPhone: customerData.phone,
    };
    
    addOrder(order);
    setOrderId(newOrderId);
    
    if (paymentMethod === 'pix') {
      const pixString = generatePixString(order);
      setPixCode(pixString);
    }
    
    setOrderComplete(true);
    clearCart();
  };
  
  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };
  
  if (orderComplete) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="bg-white rounded-lg shadow-md p-8">
          <CheckCircle
            size={64}
            className="mx-auto text-green-500 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pedido Confirmado!
          </h2>
          <p className="text-gray-600 mb-1">
            Seu pedido foi registrado com sucesso.
          </p>
          <p className="text-gray-600 mb-4">
            Número do pedido: <span className="font-medium">{orderId}</span>
          </p>
          
          {pixCode && (
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Escaneie o QR Code abaixo para efetuar o pagamento:
              </p>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <QRCodeSVG
                  value={pixCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={pixCode}
                  readOnly
                  className="bg-white border border-gray-300 rounded px-3 py-2 text-sm w-full"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPixCode}
                  title="Copiar código PIX"
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          )}
          
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            fullWidth
          >
            Voltar ao Cardápio
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PaymentForm totalAmount={totalAmount} onSubmit={handlePayment} />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary items={cartItems} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;