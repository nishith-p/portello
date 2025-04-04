import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware/auth';
import { errorResponse, ValidationError } from '@/lib/api/errors';
import { getUserOrders } from '@/lib/api/services/orders';

/**
 * GET /api/store/orders/my
 * Get current user's orders
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      if (!user || !user.id) {
        throw new ValidationError('User is required');
      }
      
      const orders = await getUserOrders(user.id);
      return NextResponse.json(orders);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true
  });
}