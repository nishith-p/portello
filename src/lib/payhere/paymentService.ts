import crypto from 'crypto';
import { getOrderById, updateOrderStatus, insertPaymentRecord } from './paymentRepository';
import { OrderStatus } from '@/lib/store/types';
import { updateUserPaymentStatus, getUserByKindeId } from '@/lib/users/db';

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
 * Verifies MD5 signature and processes payment notification.
 * For delegate payments (marked with custom_1 starting with "delegate|"), 
 * only updates the payments table. The users.payment column is updated by the notification handler.
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

  // Verify MD5 signature
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

  // Skip delegate payments (they're handled by the notification handler)
  if (custom_1?.startsWith('delegate|')) {
    return;
  }

  // For merch orders, proceed with normal processing
  await getOrderById(order_id);

  // Update order status
  let newStatus: OrderStatus;
  switch (status_code) {
    case '2':
      newStatus = 'paid';
      break;
    case '0':
      newStatus = 'payment pending';
      break;
    case '-1':
      newStatus = 'payment cancelled';
      break;
    case '-2':
      newStatus = 'payment failed';
      break;
    case '-3':
      newStatus = 'charged back';
      break;
    default:
      newStatus = 'failed';
  }
  await updateOrderStatus(order_id, newStatus, 'payhere-webhook');

  // Record payment in payments table
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

/**
 * Handles delegate payment completion (called from notification handler)
 */
export async function processDelegatePayment(
  payload: Record<string, string>
): Promise<void> {
  const {
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    custom_1,
    custom_2,
    method,
    status_message,
  } = payload;

  // Only process successful payments
  if (status_code !== '2') {
    return;
  }

  // Extract user email from custom_1 (format: "delegate|email")
  const email = custom_1?.split('|')[1];
  if (!email) {
    throw new Error('Invalid delegate payment format');
  }

  // Get user record
  const user = await getUserByKindeId(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Record payment in payments table
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

  // Update user's payment status
  await updateUserPaymentStatus(user.kinde_id, payment_id);
}
