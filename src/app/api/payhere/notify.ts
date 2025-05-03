import type { NextApiRequest, NextApiResponse } from 'next';
import { processPayHereNotification } from '@/lib/payhere/paymentService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    await processPayHereNotification(req.body);
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Notification processing failed:', err);
    return res.status(500).send('Server Error');
  }
}