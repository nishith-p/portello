// lib/payhere/payementService.ts
import crypto from 'crypto';
import { getOrderById, updateOrderStatus, insertPaymentRecord } from './paymentRepository';
import { OrderStatus } from '@/lib/store/types';

export interface PaymentRecordInput {
  payment_id: string;
  payhere_amount: number;
  payhere_currency: string;
  status_code: string;
  method?: string;
  status_message?: string;
  custom_1?: string;
  custom_2?: string;
  created_at?: string;
}

/**
 * Verifies MD5 signature and persists order + payment.
 */
export async function processPayHereNotification(
  payload: Record<string, string>
): Promise<void> {
  const {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    custom_1,
    custom_2,
    method,
    status_message,
  } = payload;

  const secret = process.env.PAYHERE_MERCHANT_SECRET!;
  const hashedSecret = crypto
    .createHash('md5')
    .update(secret)
    .digest('hex')
    .toUpperCase();

  const raw = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
  const localSig = crypto.createHash('md5').update(raw).digest('hex').toUpperCase();
  if (localSig !== md5sig) {
    throw new Error('Invalid MD5 signature');
  }

  // Ensure order exists
  await getOrderById(order_id);

  // Update status
  let newStatus: OrderStatus;
  switch (status_code) {
    case '2':
      newStatus = 'paid';      // success
      break;
    case '0':
      newStatus = 'payment pending';   // pending
      break;
    case '-1':
      newStatus = 'payment cancelled'; // canceled
      break;
    case '-2':
      newStatus = 'payment failed';    // failed
      break;
    case '-3':
      newStatus = 'charged back'; // chargedback
      break;
    default:
      newStatus = 'failed';    // fallback
  }
  await updateOrderStatus(order_id, newStatus, 'payhere-webhook');

  // Record payment
  const paymentInput: PaymentRecordInput = {
    payment_id,
    payhere_amount: parseFloat(payhere_amount),
    payhere_currency,
    status_code,
    method,
    status_message,
    custom_1,
    custom_2,
    created_at: new Date().toISOString(),
  };
  await insertPaymentRecord(order_id, paymentInput);
}
