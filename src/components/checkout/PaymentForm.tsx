import React, { useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PaymentFormProps {
  totalAmount: number;
  onSubmit: (paymentMethod: PaymentMethod, customerData: { name: string; phone: string }) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Número do cartão é obrigatório';
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Número de cartão inválido';
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
      }
      
      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'Data de validade é obrigatória';
      } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Data de validade deve estar no formato MM/AA';
      }
      
      if (!cardCvv.trim()) {
        newErrors.cardCvv = 'CVV é obrigatório';
      } else if (!/^\d{3,4}$/.test(cardCvv)) {
        newErrors.cardCvv = 'CVV inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(paymentMethod, { name, phone });
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };
  
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let formatted = value.replace(/[^\d]/g, '');
    
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
    }
    
    setCardExpiry(formatted);
    
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Informações de Contato
        </h3>
        <Input
          label="Nome Completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          placeholder="Seu nome completo"
          error={errors.name}
        />
        <Input
          label="Telefone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
          }}
          placeholder="(00) 00000-0000"
          error={errors.phone}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Método de Pagamento
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div
            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              paymentMethod === 'pix'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setPaymentMethod('pix')}
          >
            <Smartphone className="text-green-600 mb-2" size={24} />
            <span className="font-medium">PIX</span>
          </div>
          
          <div
            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              paymentMethod === 'credit'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('credit')}
          >
            <CreditCard className="text-blue-600 mb-2" size={24} />
            <span className="font-medium">Cartão de Crédito</span>
          </div>
          
          <div
            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
              paymentMethod === 'debit'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setPaymentMethod('debit')}
          >
            <CreditCard className="text-orange-600 mb-2" size={24} />
            <span className="font-medium">Cartão de Débito</span>
          </div>
        </div>
        
        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
          <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-3">
              Informações do Cartão
            </h4>
            
            <Input
              label="Número do Cartão"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              error={errors.cardNumber}
            />
            
            <Input
              label="Nome no Cartão"
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: '' }));
              }}
              placeholder="Nome impresso no cartão"
              error={errors.cardName}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Validade (MM/AA)"
                value={cardExpiry}
                onChange={handleCardExpiryChange}
                placeholder="MM/AA"
                maxLength={5}
                error={errors.cardExpiry}
              />
              
              <Input
                label="CVV"
                value={cardCvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setCardCvv(value);
                  if (errors.cardCvv) setErrors((prev) => ({ ...prev, cardCvv: '' }));
                }}
                placeholder="123"
                maxLength={4}
                error={errors.cardCvv}
              />
            </div>
          </div>
        )}
        
        {paymentMethod === 'pix' && (
          <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50 text-center">
            <h4 className="font-medium text-gray-700 mb-2">
              Pagamento por PIX
            </h4>
            <p className="text-gray-600 mb-4">
              Após confirmar o pedido, um QR Code será gerado para pagamento.
            </p>
            <div className="bg-green-100 p-3 rounded-lg inline-block">
              <Smartphone className="text-green-600 mx-auto" size={48} />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total a pagar:</span>
          <span className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          className="mt-2"
        >
          {paymentMethod === 'pix'
            ? 'Gerar QR Code para Pagamento'
            : 'Finalizar Pedido'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;