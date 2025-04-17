import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse } from '@/lib/core/errors';
import { getUserOrders } from '@/lib/store/orders/db';

/**
 * GET /api/store/orders/my
 * Get all orders for the current user
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (_req, user) => {
      try {
        if (!user || !user.id) {
          return NextResponse.json([], { status: 200 });
        }

        const orders = await getUserOrders(user.id);
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
