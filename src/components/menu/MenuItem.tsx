import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(item, quantity);
    setQuantity(1);
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = 'Item adicionado ao carrinho!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };
  
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-white/80 backdrop-blur-md hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1" padding="none">
      <div
        className="h-48 bg-center bg-cover relative"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        <p className="text-blue-600 font-bold text-xl">
          {formatCurrency(item.price)}
        </p>
      </div>
      
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <div className="flex items-center">
          <button
            onClick={decrementQuantity}
            disabled={quantity === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              quantity === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Minus size={16} />
          </button>
          <span className="mx-3 font-medium text-lg">{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <Button onClick={handleAddToCart} variant="primary" size="sm">
          Adicionar
        </Button>
      </div>
    </Card>
  );
};

export default MenuItem;