import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../types';

const stripePromise = loadStripe('pk_test_51RUd7QFYbdHzWGQJyQMEEiH7xoGg67z455EmZD3ZROQEmV8BDSmW2EuiYLQ16Zp3jlfD6vThTwJp8vxAiJZcugJv00NmYEdTlX');

export async function redirectToCheckout(items: CartItem[]) {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe não foi inicializado corretamente');
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.item.name,
          description: item.item.description,
          images: [item.item.imageUrl],
        },
        unit_amount: Math.round(item.item.price * 100), // Stripe trabalha com centavos
      },
      quantity: item.quantity,
    }));

    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cart`,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erro ao redirecionar para o checkout:', error);
    throw error;
  }
}