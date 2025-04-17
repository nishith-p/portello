import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { errorResponse, ValidationError } from '@/lib/core/errors';
import { createOrder, getOrders } from '@/lib/store/orders/db';
import { validateOrder } from '@/lib/store/orders/validators';
import { Order, OrderItem } from '@/lib/store/types';

/**
 * GET /api/orders
 * Get all orders (admin only)
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async () => {
      try {
        const orders = await getOrders();
        return NextResponse.json(orders);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
      requireAdmin: true,
    }
  );
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (_req, user) => {
      try {
        if (!user || !user.id) {
          throw new ValidationError('User is required', { user: 'User ID is required' });
        }

        // Parse request body
        let body: { items: any[]; total_amount?: number } | any[];
        try {
          body = await request.json();
        } catch (e) {
          throw new ValidationError('Invalid JSON in request body');
        }

        // Handle the case where body could be an array (just items) or an object with items property
        const orderItems = Array.isArray(body) ? body : body.items;
        const totalAmount = Array.isArray(body)
          ? orderItems.reduce(
              (sum: number, item: { price: number; quantity: number }) =>
                sum + item.price * item.quantity,
              0
            )
          : parseFloat(String(body.total_amount));

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
          throw new ValidationError('Order must contain at least one item', {
            items: 'Items array is required',
          });
        }

        const serviceData = {
          user_id: user.id,
          status: 'pending' as const,
          total_amount: totalAmount,
          items: orderItems as Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[],
        };

        validateOrder(serviceData as unknown as Order);

        const newOrder = await createOrder(serviceData);
        return NextResponse.json(newOrder, { status: 201 });
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
    }
  );
}
