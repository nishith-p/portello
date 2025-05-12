import { NextResponse } from 'next/server';
import { processPayHereNotification } from '@/lib/payhere/paymentService';
import { updateUserPaymentStatus, getUserByKindeId } from '@/lib/users/db';
import { supabaseServer } from '@/lib/core/supabase';

export async function POST(req: Request) {
  const formData = await req.formData();
  const payload: Record<string, string> = {};
  formData.forEach((value, key) => {
    payload[key] = Array.isArray(value) ? value[0] : value.toString();
  });

  try {
    // Check if this is a delegate payment (has custom_1 starting with "delegate|")
    if (payload.custom_1 && payload.custom_1.startsWith('delegate|')) {
      const email = payload.custom_1.split('|')[1];
      
      // Process as delegate payment
      if (payload.status_code === '2') { // Only if payment was successful
        const user = await getUserByKindeId(email);
        if (!user) {
          throw new Error('User not found');
        }
        
        // Update both payments table and user.payment
        const paymentInput = {
          payment_id: payload.payment_id,
          payhere_amount: parseFloat(payload.payhere_amount),
          payhere_currency: payload.payhere_currency,
          status_code: payload.status_code,
          method: payload.method,
          status_message: payload.status_message,
          custom_1: payload.custom_1,
          custom_2: payload.custom_2,
          created_at: new Date().toISOString(),
        };
        
        // Insert into payments table
        await supabaseServer.from('payments').insert({
          order_id: payload.order_id,
          ...paymentInput
        });
        
        // Update user.payment only for delegate payments
        await updateUserPaymentStatus(user.kinde_id, payload.payment_id);
      }
    } else {
      // Process as regular merch order (only update payments table)
      await processPayHereNotification(payload);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('PayHere notify error:', err);
    return NextResponse.json(
      { error: err.message || 'Processing error' },
      { status: 500 }
    );
  }
}
