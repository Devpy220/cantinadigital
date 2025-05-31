import React from 'react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalAmount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.item.id} className="py-3 flex justify-between">
            <div>
              <span className="font-medium">{item.quantity}x </span>
              {item.item.name}
            </div>
            <div className="font-medium">
              {formatCurrency(item.item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;