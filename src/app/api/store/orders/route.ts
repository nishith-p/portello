import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware/auth';
import { errorResponse, ValidationError } from '@/lib/api/errors';
import { getOrders, createOrder } from '@/lib/api/services/orders';
import { getStoreItem } from '@/lib/api/services/store';
import { validateOrder } from '@/lib/api/validators/orders';
import { Order } from '@/types/store';

/**
 * GET /api/store/orders
 * Get all orders (admin only)
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const orders = await getOrders();
      return NextResponse.json(orders);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: true // Only admins can access all orders
  });
}

/**
 * POST /api/store/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (_req, user) => {
    try {
      if (!user) {
        throw new ValidationError('User is required');
      }
      
      // Parse request body
      const body = await request.json();
      
      // Create order object from request body
      const orderData: Order = {
        user_id: user.id,
        status: 'pending',
        total_amount: parseFloat(body.total_amount),
        items: body.items
      };
      
      // Validate the order data
      validateOrder(orderData);
      
      // Enhance items with store data where possible
      const enhancedItems = [];
      for (const item of body.items) {
        try {
          // Get store item data if not already provided
          if (!item.name || !item.image) {
            const storeItem = await getStoreItem(item.item_code);
            if (storeItem) {
              // Add name if not provided
              if (!item.name) {
                item.name = storeItem.name;
              }

              // Add image if not provided and images exist
              if (!item.image && storeItem.images && storeItem.images.length > 0) {
                item.image = storeItem.images[0];
              }
            }
          }
          enhancedItems.push(item);
        } catch (e) {
          // Just add the original item if there's an error
          enhancedItems.push(item);
        }
      }
      
      // Update the order items with enhanced data
      orderData.items = enhancedItems;
      
      // Create the order
      const newOrder = await createOrder(orderData);
      
      return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true
  });
}