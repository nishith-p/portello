import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/api/db/orders';
import { errorResponse, ValidationError } from '@/lib/api/errors';
import { withAuth } from '@/lib/api/middleware/auth';
import { validateOrder } from '@/lib/api/validators/orders';
import { Order, OrderItem } from '@/types/store';

/**
 * GET /api/store/orders
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
      requireAdmin: true, // Only admins can access all orders
    }
  );
}

/**
 * POST /api/store/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user || !user.id) {
          throw new ValidationError('User is required', { user: 'User ID is required' });
        }

        // Parse request body
        let body;
        try {
          body = await request.json();
        } catch (e) {
          console.error('Error parsing JSON:', e);
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
          : parseFloat(body.total_amount);

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
          throw new ValidationError('Order must contain at least one item', {
            items: 'Items array is required',
          });
        }

        // Create order object for createOrder
        const serviceData = {
          user_id: user.id,
          status: 'pending' as const,
          total_amount: totalAmount,
          items: orderItems as Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[],
        };

        // Validate and create the order with type assertion
        try {
          validateOrder(serviceData as unknown as Order);
        } catch (validationError) {
          console.error('Validation error:', validationError);
          throw validationError;
        }

        let newOrder;
        try {
          newOrder = await createOrder(serviceData);
        } catch (createError) {
          console.error('Create order error:', createError);
          throw createError;
        }

        return NextResponse.json(newOrder, { status: 201 });
      } catch (error) {
        console.error('Order creation error:', error);
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
    }
  );
}
