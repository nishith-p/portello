import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { orderId, amount, currency = 'USD' } = await req.json();
  if (!orderId || amount == null) {
    return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });
  }

  // load env
  const accessKey = process.env.CYBS_ACCESS_KEY!;
  const secretKey = process.env.CYBS_SECRET_KEY!;
  const profileId = process.env.CYBS_PROFILE_ID!;
  const env = process.env.CYBS_ENV || 'test';
  const successUrl = process.env.NEXT_PUBLIC_SUCCESS_URL!;
  const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL!;
  const postUrl = process.env.CYBS_MERCHANT_POST_URL!;

  // define fields
  const fields: Record<string, string> = {
    access_key: accessKey,
    profile_id: profileId,
    transaction_uuid: crypto.randomUUID(),
    signed_field_names:
      'access_key,profile_id,transaction_uuid,transaction_type,reference_number,amount,currency,locale,success_url,cancel_url,merchant_post_url',
    unsigned_field_names: '',
    transaction_type: 'sale',
    reference_number: orderId,
    amount: parseFloat(amount.toString()).toFixed(2),
    currency,
    locale: 'en-us',
    success_url: successUrl,
    cancel_url: cancelUrl,
    merchant_post_url: postUrl,
  };

  // create signature
  const signedNames = fields.signed_field_names.split(',');
  const dataToSign = signedNames.map((name) => `${name}=${fields[name]}`).join(',');
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretKey, 'utf8'))
    .update(dataToSign)
    .digest('base64');

  fields.signature = signature;

  // gateway URL
  const actionUrl =
    env === 'live'
      ? 'https://secureacceptance.cybersource.com/pay'
      : 'https://testsecureacceptance.cybersource.com/pay';

  return NextResponse.json({ actionUrl, fields });
}
