import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { processCreditPayment } from '@/lib/wallet/db';

/**
 * POST /api/orders/credit-payment
 * Process credit payment for an order
 */
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user || !user.id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, amount } = body;

        if (!orderId || !amount || amount <= 0) {
          return NextResponse.json({ error: 'Invalid order ID or amount' }, { status: 400 });
        }

        const result = await processCreditPayment(user.id, orderId, amount);

        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Payment processed successfully' });
      } catch (error) {
        console.error('Error in credit payment API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    },
    {
      requireAuth: true,
    }
  );
}
