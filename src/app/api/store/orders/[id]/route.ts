import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, withAuth } from '@/lib/auth/utils';
import { RouteContext } from '@/lib/common-types';
import { AuthorizationError, errorResponse, ValidationError } from '@/lib/core/errors';
import { getOrder, getOrderAudit, updateOrderStatus } from '@/lib/store/orders/db';
import { validateOrderStatus } from '@/lib/store/orders/validators';
import { OrderStatus } from '@/lib/store/types';

/**
 * GET /api/orders/[id]
 * Get a specific order
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
) {
  return withAuth(
    request,
    async (_req, user) => {
      try {
        const { id } = await context.params;

        if (!id) {
          throw new ValidationError('Order ID is required');
        }

        const order = await getOrder(id);

        // Check if user is the order owner or admin
        const userIsAdmin = await isAdmin();
        if (!userIsAdmin && order.user_id !== user?.id) {
          throw new AuthorizationError('You can only view your own orders');
        }

        return NextResponse.json(order);
      } catch (error) {
        return errorResponse(error as Error);
      }
    },
    {
      requireAuth: true,
    }
  );
}

/**
 * PUT /api/orders/[id]
 * Update order status (admin only)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<RouteContext['params']> }
) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const { id } = await context.params;

        if (!id) {
          throw new ValidationError('Order ID is required');
        }

        // Parse request body
        let body: { status: string };
        try {
          body = await req.json();
        } catch (e) {
          throw new ValidationError('Invalid JSON in request body');
        }

        const { status } = body;

        if (!status) {
          throw new ValidationError('Status is required');
        }

        // Validate status
        validateOrderStatus(status);

        // Get the existing order to check if it exists
        const existingOrder = await getOrder(id);

        // Don't update if status is the same
        if (existingOrder.status === status) {
          return NextResponse.json({
            message: `No changes made - status is already set to ${status}`,
            order: existingOrder,
          });
        }

        // Update order status with audit information
        const updatedOrder = await updateOrderStatus(id, status as OrderStatus, user!.id);

        // Get audit information
        const auditInfo = await getOrderAudit(id);

        return NextResponse.json({
          ...updatedOrder,
          auditInfo,
        });
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
