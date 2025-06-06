import { Order } from '../types';
import { formatCurrency } from './formatters';

export const sendOrderToWhatsApp = (order: Order): void => {
  const message = `🎉 *NOVO PEDIDO - ${order.id}*

👤 *Cliente:* ${order.customerName}
📱 *Telefone:* ${order.customerPhone}

📋 *Itens do Pedido:*
${order.items.map(item => 
  `• ${item.quantity}x ${item.item.name} - ${formatCurrency(item.item.price * item.quantity)}`
).join('\n')}

💰 *Total:* ${formatCurrency(order.totalAmount)}

📅 *Data:* ${new Date(order.createdAt).toLocaleString('pt-BR')}

---
Pedido realizado através da Plataforma de Eventos`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/55${order.organizerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

export const sendOrderConfirmationToCustomer = (order: Order, eventName: string): void => {
  const message = `✅ *PEDIDO CONFIRMADO*

Olá ${order.customerName}! Seu pedido foi confirmado.

🎪 *Evento:* ${eventName}
🆔 *Número do Pedido:* ${order.id}

📋 *Seus Itens:*
${order.items.map(item => 
  `• ${item.quantity}x ${item.item.name}`
).join('\n')}

💰 *Total:* ${formatCurrency(order.totalAmount)}

Em breve você receberá mais informações sobre a retirada do seu pedido.

Obrigado pela preferência! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/55${order.customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};