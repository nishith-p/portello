import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer } = body;

    if (!customer?.email) {
      return NextResponse.json(
        { error: 'Customer email is required' }, 
        { status: 400 }
      );
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const returnUrl = process.env.NEXT_PUBLIC_RETURN_URL;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL;
    const notifyUrl = process.env.PAYHERE_NOTIFY_URL;
    const env = process.env.PAYHERE_ENV || 'sandbox';

    if (!merchantId || !merchantSecret || !returnUrl || !cancelUrl || !notifyUrl) {
      throw new Error('Missing PayHere environment configuration');
    }

    // Calculate amount based on position
    const amount = ['MCPc', 'MCPe'].includes(customer.position) ? 100 : 70;
    const formattedAmount = amount.toFixed(2);
    const currency = 'EUR';
    const orderId = `delegate-${uuidv4()}`; // Generate unique order ID

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

    const fields = {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: `Delegate Fee for ${customer.first_name} ${customer.last_name}`,
      currency,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      amount: formattedAmount,
      hash,
      custom_1: `delegate|${customer.email}`, // Store email in custom field
      custom_2: customer.position, // Store position in custom field
    };

    return NextResponse.json({ actionUrl, fields });
  } catch (error: any) {
    console.error('Delegate checkout creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
