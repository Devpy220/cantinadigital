import { Order } from '../types';

interface PixConfig {
  merchantName: string;
  merchantCity: string;
  key: string;
}

const PIX_CONFIG: PixConfig = {
  merchantName: 'CANTINA DIGITAL',
  merchantCity: 'SAO PAULO',
  key: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000',  // Exemplo de chave PIX
};

function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

export function generatePixString(order: Order): string {
  const payload = [
    '00020126',  // Payload Format Indicator + Merchant Account Information
    '26', padNumber(PIX_CONFIG.merchantName.length + 4, 2),
    '0014BR.GOV.BCB.PIX', PIX_CONFIG.key,
    '52040000', // Merchant Category Code
    '5303986',  // Transaction Currency (986 = BRL)
    '54', padNumber(order.totalAmount.toFixed(2).length, 2),
    order.totalAmount.toFixed(2),
    '59', padNumber(PIX_CONFIG.merchantName.length, 2),
    removeDiacritics(PIX_CONFIG.merchantName),
    '60', padNumber(PIX_CONFIG.merchantCity.length, 2),
    removeDiacritics(PIX_CONFIG.merchantCity),
    '62', padNumber(order.id.length + 4, 2),
    '05', padNumber(order.id.length, 2),
    order.id,
    '6304',  // CRC16
  ].join('');

  // Em um ambiente real, você calcularia o CRC16 aqui
  // Para este exemplo, usamos um valor fixo
  return payload + 'A04F';
}