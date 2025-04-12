import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders } from '@/lib/api/db/orders';
import { errorResponse } from '@/lib/api/errors';
import { withAuth } from '@/lib/api/middleware/auth';

/**
 * GET /api/store/orders/my
 * Get current user's orders
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (_req, user) => {
      try {
        const orders = await getUserOrders(user!.id);
        return NextResponse.json(orders);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
    }
  );
}
