import crypto from 'crypto';
import { getOrderById, updateOrderStatus, insertPaymentRecord } from './paymentRepository';
import { OrderStatus } from '@/lib/store/types';
import { getUserByKindeId } from '../users/db';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

interface CheckoutParams {
  orderId: string
  amount: number
}

interface CheckoutResult {
  actionUrl: string
  fields: Record<string, string>
}

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


export async function createPayhereCheckout({ orderId, amount }: CheckoutParams): Promise<CheckoutResult> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const merchantId = process.env.PAYHERE_MERCHANT_ID
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  const returnUrl = process.env.NEXT_PUBLIC_RETURN_URL
  const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL
  const notifyUrl = process.env.PAYHERE_NOTIFY_URL
  const env = process.env.PAYHERE_ENV || "sandbox"

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const dbUser = await getUserByKindeId(user.id);
  const firstName = dbUser?.first_name || 'Guest';
  const email = dbUser?.aiesec_email || 'Email';
  const country = dbUser?.entity || 'Country';

  if (!merchantId || !merchantSecret || !returnUrl || !cancelUrl || !notifyUrl) {
    throw new Error("Missing PayHere environment configuration")
  }

  const formattedAmount = Number.parseFloat(amount.toString()).toFixed(2)
  const currency = "EUR"

  const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase()

  const rawHash = merchantId + orderId + formattedAmount + currency + hashedSecret
  const hash = crypto.createHash("md5").update(rawHash).digest("hex").toUpperCase()

  const actionUrl = env === "live" ? "https://www.payhere.lk/pay/checkout" : "https://sandbox.payhere.lk/pay/checkout"

  const fields: Record<string, string> = {
    merchant_id: merchantId,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    order_id: orderId,
    items: `Order ${orderId}`,
    currency,
    first_name: firstName,
    email: email,
    country: country,
    amount: formattedAmount,
    hash,
  }

  return { actionUrl, fields }
}
