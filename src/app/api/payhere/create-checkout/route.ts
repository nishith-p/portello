import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { orderId, amount } = body;

  if (!orderId || amount == null) {
    return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });
  }

  try {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const returnUrl = process.env.NEXT_PUBLIC_RETURN_URL;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL;
    const notifyUrl = process.env.PAYHERE_NOTIFY_URL;
    const env = process.env.PAYHERE_ENV || 'sandbox';

    if (!merchantId || !merchantSecret || !returnUrl || !cancelUrl || !notifyUrl) {
      throw new Error('Missing PayHere environment configuration');
    }

    const formattedAmount = parseFloat(amount.toString()).toFixed(2);
    const currency = 'EUR';

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

    const actionUrl = env === 'live'
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';

    const fields: Record<string, string> = {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: `Order ${orderId}`,
      currency,
      first_name: "Lahiru",
      last_name: "Jayathilake",
      email: "lahiruthpala@gmail.com",
      phone : "0718696971",
      address: "63/1, Dolekanaththa Junction, Nampamunuwa",
      city: "Piliyandala",
      country: "Sri Lanka",
      amount: formattedAmount,
      hash,
    };

    return NextResponse.json({ actionUrl, fields });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
