import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, errorResponse } from '@/app/api/utils/auth';
import { getStoreItem, toggleItemActive } from '@/app/api/utils/db';

// PATCH /api/store/items/[id]/toggle-active - Toggle item active status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    await isAdmin();

    const itemCode = params.id;

    // Parse request body for the active status
    const body = await request.json();
    const active = body.active;

    // Validate active parameter
    if (typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Active status must be a boolean' },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await getStoreItem(itemCode);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Toggle active status
    const updatedItem = await toggleItemActive(itemCode, active);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: active ? 'Item activated' : 'Item deactivated'
    });
  } catch (error) {
    return errorResponse(
      error as Error,
      (error as Error).message === 'Unauthorized' ? 403 : 400
    );
  }
}