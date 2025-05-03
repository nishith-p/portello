import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export type CheckoutRequest = {
  orderId: string;
  amount: number;
};

export type CheckoutResponse = {
  actionUrl: string;
  fields: Record<string, string>;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, amount } = req.body as CheckoutRequest;
  if (!orderId || amount == null) {
    return res.status(400).json({ error: 'Missing orderId or amount' });
  }

  try {
    // Fetch credentials from env
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const returnUrl = process.env.NEXT_PUBLIC_RETURN_URL;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL;
    const notifyUrl = process.env.PAYHERE_NOTIFY_URL;
    const env = process.env.PAYHERE_ENV || 'sandbox';

    if (!merchantId || !merchantSecret || !returnUrl || !cancelUrl || !notifyUrl) {
      throw new Error('Missing PayHere environment configuration');
    }

    // Prepare values
    const formattedAmount = parseFloat(amount.toString()).toFixed(2);
    const currency = 'EUR';

    // Hash secret and payload
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const rawHash = merchantId + orderId + formattedAmount + currency + hashedSecret;
    const hash = crypto
      .createHash('md5')
      .update(rawHash)
      .digest('hex')
      .toUpperCase();

    // Determine gateway URL
    const actionUrl = env === 'live'
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';

    // Build form fields
    const fields: Record<string, string> = {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: `Order ${orderId}`,
      currency,
      amount: formattedAmount,
      hash,
    };

    return res.status(200).json({ actionUrl, fields });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return res.status(500).json({ error: error.message || 'Server Error' });
  }
}
