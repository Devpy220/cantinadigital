import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, totalItems } = useCart();
  
  // Set page title
  useEffect(() => {
    document.title = 'Carrinho | Cantina Digital';
    return () => {
      document.title = 'Cantina Digital';
    };
  }, []);
  
  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600 mb-6">
          Adicione alguns itens deliciosos do nosso cardápio para continuar
        </p>
        <Link to="/">
          <Button variant="primary">Ver Cardápio</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/" className="flex items-center text-orange-500 hover:text-orange-600">
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar ao Cardápio</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 ml-auto">
          Meu Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <CartItem key={item.item.id} item={item} />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;