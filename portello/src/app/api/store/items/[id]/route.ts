import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/middleware/auth';
import { errorResponse } from '@/lib/api/errors';
import { getStoreItem, updateStoreItem, deleteStoreItem } from '@/lib/api/services/store';
import { validateStoreItem } from '@/lib/api/validators/store';

/**
 * GET /api/store/items/[id]
 * Fetch a specific store item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const item = await getStoreItem(params.id);
      return NextResponse.json(item);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: false
  });
}

/**
 * PUT /api/store/items/[id]
 * Update a store item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const body = await request.json();
      
      // Validate request body
      validateStoreItem(body);
      
      // Update the store item
      const updatedItem = await updateStoreItem(params.id, body);
      return NextResponse.json(updatedItem);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: true // Only admins can update items
  });
}

/**
 * DELETE /api/store/items/[id]
 * Delete a store item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async () => {
    try {
      const result = await deleteStoreItem(params.id);
      return NextResponse.json(result);
    } catch (error) {
      return errorResponse(error as Error);
    }
  }, {
    requireAuth: true,
    requireAdmin: true // Only admins can delete items
  });
}