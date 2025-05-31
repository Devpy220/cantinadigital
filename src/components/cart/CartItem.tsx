import React from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrease = () => {
    updateQuantity(item.item.id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.item.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.item.id);
  };
  
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
        <img
          src={item.item.imageUrl}
          alt={item.item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{item.item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">
          {formatCurrency(item.item.price)} cada
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrease}
          disabled={item.quantity === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            item.quantity === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
          }`}
        >
          <Minus size={16} />
        </button>
        
        <span className="font-medium text-gray-800 w-8 text-center">
          {item.quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="ml-6 text-right">
        <p className="font-medium text-gray-800">
          {formatCurrency(item.item.price * item.quantity)}
        </p>
      </div>
      
      <button
        onClick={handleRemove}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        <Trash size={18} />
      </button>
    </div>
  );
};

export default CartItem;