import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware/auth';
import { errorResponse, AuthorizationError, ValidationError } from '@/lib/api/errors';
import { getOrder, getOrderAudit, updateOrderStatus } from '@/lib/api/services/orders';
import { validateOrderStatus } from '@/lib/api/validators/orders';
import { OrderStatus } from '@/types/store';

/**
 * GET /api/store/orders/[id]
 * Get a specific order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (_req, user) => {
    try {
      if (!user) {
        throw new ValidationError('User is required');
      }
      
      const orderId = params.id;
      const order = await getOrder(orderId);
      
      // Check if user is the order owner or admin
      // Admin check is already done in withAuth if requireAdmin is true
      if (!user.permissions?.includes('dx:admin') && order.user_id !== user.id) {
        throw new AuthorizationError('You can only view your own orders');
      }
      
      return NextResponse.json(order);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true
  });
}

/**
 * PUT /api/store/orders/[id]
 * Update order status (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    try {
      if (!user || !user.id) {
        throw new ValidationError('User is required');
      }
      
      const orderId = params.id;
      const { status } = await request.json();
      
      // Validate status
      validateOrderStatus(status);
      
      // Get the existing order to check if it exists
      const existingOrder = await getOrder(orderId);
      
      // Don't update if status is the same
      if (existingOrder.status === status) {
        return NextResponse.json({
          message: `No changes made - status is already set to ${status}`,
          order: existingOrder,
        });
      }
      
      // Update order status with audit information
      const updatedOrder = await updateOrderStatus(
        orderId, 
        status as OrderStatus, 
        user.id
      );
      
      // Get audit information
      const auditInfo = await getOrderAudit(orderId);
      
      return NextResponse.json({
        ...updatedOrder,
        auditInfo,
      });
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: true // Only admins can update orders
  });
}